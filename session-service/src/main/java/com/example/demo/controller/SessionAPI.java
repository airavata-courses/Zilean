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
		
		String email = user.get("email").toString();
    	String access_token = generateJWTToken(user.get("email").toString());
		Session sessionObject = new Session(email,access_token);
		
    	mt.insert(sessionObject);	
    	
    	JSONObject jsonObject = new JSONObject();

        jsonObject.put("status", true);
        jsonObject.put("message", "Token Generated");
        jsonObject.put("data",sessionObject.access_token);
    	return jsonObject;	
    }
	@PostMapping("/logout")
	public JSONObject removeAccessToken(@RequestBody JSONObject user){
		
		String email = user.get("email").toString();
		Query query = new Query();
		query.addCriteria(Criteria.where("email").is(email));
		Session sessionObject = mt.findOne(query, Session.class);		
		SessionHistory sessionHistoryObject = new SessionHistory(user.get("email").toString(),sessionObject.access_token);
		mt.insert(sessionHistoryObject);
    	JSONObject jsonObject = new JSONObject();
        jsonObject.put("status", true);
        jsonObject.put("message", "Expired Token Stored");
        return jsonObject;
	}
	@PostMapping("/refresh")
	public JSONObject updateAccessToken(@RequestBody JSONObject user){
    	
		String email = user.get("email").toString();
		Query query = new Query();
		query.addCriteria(Criteria.where("email").is(email));
		Session sessionObject = mt.findOne(query, Session.class);				
		SessionHistory sessionHistoryObject = new SessionHistory(email,sessionObject.access_token);
		mt.insert(sessionHistoryObject);
		
    	String New_Access_Token = generateJWTToken(user.get("email").toString());
    	email = user.get("email").toString();
    	Session sessionUpdate = new Session(email,New_Access_Token);
		
    	Query query_update= new Query();
    	query_update.addCriteria(Criteria.where("email").is(email));
    	Update update = new Update();
    	update.set("access_token", New_Access_Token);
    	mt.updateMulti(query_update, update, Session.class);

		JSONObject jsonObject = new JSONObject();
		
        jsonObject.put("status", true);
        jsonObject.put("message", "New Token Generated");
        jsonObject.put("data",New_Access_Token);
    	return jsonObject;

  
	}
	private String generateJWTToken(@RequestBody String email) {
        long timestamp = System.currentTimeMillis();
        String Access_token = Jwts.builder().signWith(SignatureAlgorithm.HS256, SecretKey.API_SECRET_KEY)
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + SecretKey.TOKEN_VALIDITY))
                .claim("email", email)
                .compact();
        
        return Access_token;
    }
}
