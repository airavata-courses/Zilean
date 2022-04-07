import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auditApi = createApi({
    reducerPath: 'auditApi',
//     baseQuery:fetchBaseQuery({ baseUrl: process.env.GATEWAY_SERVICE_URL ||  'http://127.0.0.1:5006/v1/' }),
    baseQuery:fetchBaseQuery({ baseUrl: 'http://149.165.152.187:30010/v1/' }),
    // tagTypes:['login','signup'],
    endpoints:  (builder) =>({

        getAudits: builder.query({
            query:(data)=>{
                console.log("Inside auditApi getAudits ",data);
                
                return {
                    url:'audits?cursor=&limit=10000',
                    method:'GET',
                    headers:{
                        "Access-Token": data.access_token,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            // invalidatesTags:['login'],
        }),

        /*

        # GET requests reference from last project

        getPageDetailsOfAllPages: builder.query({
            query:(data)=>{

                // console.log("User Id is: ",data.id);
                return{
                    url:'pages/',
                    method:'GET',
                    headers:{
                        Authorization: `JWT ${data.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            providesTags:['Pages'],

        }),

        getPageDetails: builder.query({
            query:(data)=>{

                // console.log("Page Name: ",data.pageName);
                return{
                    url:`pages/${data.pageName}`,
                    method:'GET',
                    headers:{
                        Authorization: `JWT ${data.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            providesTags:['Pages'],
        }),

        */

    })
});


export const { useGetAuditsQuery } = auditApi;

