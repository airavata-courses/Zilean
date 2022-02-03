package com.example.demo.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class SessionHistory {
	public String email;
	public String access_token;

	public SessionHistory(String email, String access_token) {
		this.email = email;
		this.access_token  = access_token;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String ID) {
		this.email = ID;
	}

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	
}
