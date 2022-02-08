# Audit Service 

##Setup 

### Database Setup 

Install Postgres 11.6 

- psql postgres
- create database audit_service_test;
- create user audit_service_test with encrypted password 'audit_service_test';
- grant all privileges on database audit_service_test to audit_service_test;

### Run Application

- Install npm of version 6.4.1
- npm -v 
- Install node v10
- node -v
- npm install 
- npm run db:all:migrate
- npm start

## ER Diagram

![ER](https://github.com/airavata-courses/Zilean/blob/main-audit-service/audit-service/images/er.png)

## Developer Purpose Notes

- Create migration 
    -  sequelize migration:generate --name [migraton-name]

### Service port 

5001

### API Documentation

https://documenter.getpostman.com/view/4946631/UVeCRTx3


