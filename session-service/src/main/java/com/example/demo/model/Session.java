package com.example.demo.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Session {
	public String user_id;
	public String access_token;

	public Session(String user_id, String access_token) {
		this.user_id = user_id;
		this.access_token  = access_token;
	}

	public String getUserId() {
		return user_id;
	}

	public void setUserId(String ID) {
		this.user_id = user_id;
	}

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	
}
