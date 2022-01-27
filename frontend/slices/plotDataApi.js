import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plotDataApi = createApi({
    reducerPath: 'plotDataApi',
    baseQuery:fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
    // tagTypes:['login','signup'],
    endpoints:  (builder) =>({

        postData: builder.mutation({
            query:(data)=>{
            
                console.log("Inside plotDataAPI post data ",data);
                
                return {
                    url:'pages/create/',
                    method:'POST',
                    body:{
                        // pageName: data.pageName,
                        // pageAuthor: data.pageAuthor,
                        // pageEmail: data.pageEmail,
                        // pageDescription: data.pageDescription
                    },
                    headers:{
                        // Authorization: `JWT ${data.access_token}`,
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


export const { usePostDataMutation } = plotDataApi;

