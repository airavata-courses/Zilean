import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plotDataApi = createApi({
    reducerPath: 'plotDataApi',
    baseQuery:fetchBaseQuery({ baseUrl: 'http://localhost:5006/' }),
    // tagTypes:['login','signup'],
    endpoints:  (builder) =>({

        postData: builder.mutation({
            query:({access_token, ...data})=>{
            
                console.log("Inside plotDataAPI post data ",data);
                
                return {
                    url:'v1/weather/request',
                    method:'POST',
                    body:data,
                    headers:{
                        "Access-Token": access_token,
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


export const { usePostDataMutation } = plotDataApi;

