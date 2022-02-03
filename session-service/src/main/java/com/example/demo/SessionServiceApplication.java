package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.repository.config.RepositoryConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = {"com.example.demo.*"})
@ComponentScan(basePackages = { "com.example.demo.*" })
@EntityScan(basePackages = {"com.example.demo.model"})

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class SessionServiceApplication
{
	public static void main(String[] args) {
		SpringApplication.run(SessionServiceApplication.class, args);
	}
}



//@EnableMongoRepositories(basePackages = {"com.example.SessionService.*"})
//@ComponentScan(basePackages = { "com.example.SessionService.*" })
//@EntityScan(basePackages = {"com.example.SessionService.Person"})



