package com.example.demo.controller;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.SecretKey;
import com.example.demo.model.Session;
import com.example.demo.model.SessionHistory;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.simple.JSONObject;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;


@RestController
@RequestMapping("v1/session-service")
public class SessionAPI {

	@Autowired
	private MongoTemplate mt;

	@PostMapping("/create-session")
	public JSONObject generateSession(@RequestBody JSONObject user) {
		
		String userId = user.get("user_id").toString();
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
	public JSONObject removeAccessToken(@RequestBody JSONObject user){
		
		String userId = user.get("user_id").toString();
		Query query = new Query();
		query.addCriteria(Criteria.where("user_id").is(userId));
		Session sessionObject = mt.findOne(query, Session.class);		
		SessionHistory sessionHistoryObject = new SessionHistory(user.get("user_id").toString(),sessionObject.access_token);
		mt.insert(sessionHistoryObject);
    	JSONObject jsonObject = new JSONObject();
        jsonObject.put("status", 200);
        jsonObject.put("message", "Expired Token Stored");
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
		
    	String New_Access_Token = generateJWTToken(user.get("user_id").toString());
    	userId = user.get("user_id").toString();
    	Session sessionUpdate = new Session(userId, New_Access_Token);
		
    	Query query_update= new Query();
    	query_update.addCriteria(Criteria.where("user_id").is(userId));
    	Update update = new Update();
    	update.set("access_token", New_Access_Token);
    	mt.updateMulti(query_update, update, Session.class);

		JSONObject jsonObject = new JSONObject();
		
        jsonObject.put("status", true);
        jsonObject.put("message", "New Token Generated");
        jsonObject.put("data",New_Access_Token);
    	return jsonObject;
	}
	private String generateJWTToken(@RequestBody String userId) {
        long timestamp = System.currentTimeMillis();
        String Access_token = Jwts.builder().signWith(SignatureAlgorithm.HS256, SecretKey.API_SECRET_KEY)
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + SecretKey.TOKEN_VALIDITY))
                .claim("userId", userId)
                .compact();
        
        return Access_token;
    }
}
