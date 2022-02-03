package com.example.demo.controller;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.SecretKey;
import com.example.demo.model.Session;
import com.example.demo.model.SessionHistory;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.simple.JSONObject;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@RestController
@RequestMapping("v1/session-service")
public class SessionAPI {

	@Autowired
	private MongoTemplate mt;

	@PostMapping("/create-session")
	public JSONObject generateSession(@RequestBody JSONObject user) {


		String userId = user.get("user_id").toString();

		Query query = new Query();
		query.addCriteria(Criteria.where("user_id").is(userId));
		Session userExistingSession = mt.findOne(query, Session.class);
		
		if (userExistingSession != null) {
			JSONObject jsonObject = new JSONObject();
			if (validateToken(userExistingSession.access_token)) {
				
				jsonObject.put("status", 200);
				jsonObject.put("message", "Access Token Recycled");
				jsonObject.put("access_token", userExistingSession.access_token);
				return jsonObject;
			} else {
				mt.insert(new SessionHistory(userId, userExistingSession.access_token));
				String newAccessToken = updateSession(userId);
				jsonObject.put("status", 200);
				jsonObject.put("message", "New Token Generated");
				jsonObject.put("data",newAccessToken);
				return jsonObject;
			}
		}
		String accessToken = generateJWTToken(userId);
		Session sessionObject = new Session(userId, accessToken);
    	mt.insert(sessionObject);	
    	JSONObject jsonObject = new JSONObject();
		jsonObject.put("status", 200);
        jsonObject.put("message", "Token Generated");
        jsonObject.put("access_token", sessionObject.access_token);
    	return jsonObject;
	}	

	@PostMapping("/logout")
	public JSONObject removeAccessToken(@RequestBody JSONObject reqBody){
		String userId = reqBody.get("user_id").toString();
		Query query = new Query();
		query.addCriteria(Criteria.where("user_id").is(userId));
		Session sessionObject = mt.findOne(query, Session.class);
		if (sessionObject != null) {
			SessionHistory sessionHistoryObject = new SessionHistory(userId,sessionObject.access_token);
			mt.insert(sessionHistoryObject);
			JSONObject jsonObject = new JSONObject();
        	jsonObject.put("status", 200);
        	jsonObject.put("message", "Expired Token Stored");
        	return jsonObject;
		} else {
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("status", 404);
			jsonObject.put("message", "Session Not Found");
			return jsonObject;
		}
	}

	@GetMapping("/validate")
	public JSONObject validateAccessToken(@RequestBody JSONObject reqBody){
		String accessToken = reqBody.get("access_token").toString();

		JSONObject jsonObject = new JSONObject();
		Query query = new Query();
		query.addCriteria(Criteria.where("access_token").is(accessToken));
		Session userExistingSession = mt.findOne(query, Session.class);
		if (validateToken(userExistingSession.access_token)) {
			Jws <Claims> claims = Jwts.parser().setSigningKey(SecretKey.API_SECRET_KEY).parseClaimsJws(userExistingSession.access_token);
			jsonObject.put("status", 200);
			jsonObject.put("message", "Valided");
			jsonObject.put("user_id",  claims.getBody().get("userId"));
			return jsonObject;
		} 
		jsonObject.put("status", 401);
		jsonObject.put("message", "Invalid Access Token");
		return jsonObject;
	}

	@PostMapping("/refresh")
	public JSONObject updateAccessToken(@RequestBody JSONObject user){
		String userId = user.get("user_id").toString();
		Query query = new Query();
		query.addCriteria(Criteria.where("user_id").is(userId));
		Session sessionObject = mt.findOne(query, Session.class);				
		SessionHistory sessionHistoryObject = new SessionHistory(userId,sessionObject.access_token);
		mt.insert(sessionHistoryObject);
    	String newAccessToken = updateSession(userId);
		JSONObject jsonObject = new JSONObject();
        jsonObject.put("status", 200);
        jsonObject.put("message", "New Token Generated");
        jsonObject.put("access_token",newAccessToken);
    	return jsonObject;
	}

	private String generateJWTToken(@RequestBody String userId) {
        long timestamp = System.currentTimeMillis();
        String access_token = Jwts.builder().signWith(SignatureAlgorithm.HS256, SecretKey.API_SECRET_KEY)
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + SecretKey.TOKEN_VALIDITY))
                .claim("userId", userId)
                .compact();
        
        return access_token;
    }

	private boolean validateToken(@RequestBody String authToken) {
		try {
			Jws <Claims> claims = Jwts.parser().setSigningKey(SecretKey.API_SECRET_KEY).parseClaimsJws(authToken);
			return true;
		} catch (Exception ex) {
			System.out.println(ex);
			return false;
		}
	}

	private String updateSession(@RequestBody String userId) {
		String newAccessToken = generateJWTToken(userId);
    	Session sessionUpdate = new Session(userId, newAccessToken);
    	Query query_update= new Query();
    	query_update.addCriteria(Criteria.where("user_id").is(userId));
    	Update update = new Update();
    	update.set("access_token", newAccessToken);
    	mt.updateMulti(query_update, update, Session.class);
		return newAccessToken;
	}

}
