import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plotDataApi = createApi({
    reducerPath: 'plotDataApi',
    baseQuery:fetchBaseQuery({ baseUrl: process.env.GATEWAY_SERVICE_URL || 'http://localhost:5006/v1/' }),
    tagTypes:['requestsHistory'],
    endpoints:  (builder) =>({

        postData: builder.mutation({
            query:({access_token, ...data})=>{
            
                // console.log("Inside plotDataAPI post data ",data);
                
                return {
                    url:'/weather/request',
                    method:'POST',
                    body:data,
                    headers:{
                        "Access-Token": access_token,
                        "Content-Type": "application/json",
                      },
                }
            },
            // invalidatesTags:['requestsHistory'],
        }),

        getRequestsHistory: builder.query({
            query:(data)=>{

                // console.log("inside plorDataApi getRequestsHistory ",data);
                return{
                    url:'/plots',
                    method:'GET',
                    headers:{
                        "Access-Token": data.access_token,
                        "Access-Control-Allow-Origin":"*",
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            invalidatesTags:['requestsHistory'],
                
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


export const { usePostDataMutation, useGetRequestsHistoryQuery } = plotDataApi;

