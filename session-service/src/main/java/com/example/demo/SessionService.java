package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = {"com.example.demo.*"})
@ComponentScan(basePackages = { "com.example.demo.*" })
@EntityScan(basePackages = {"com.example.demo.model"})

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class SessionService
{
	public static void main(String[] args) {
		SpringApplication.run(SessionService.class, args);
	}
}
