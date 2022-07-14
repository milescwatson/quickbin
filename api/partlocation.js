fetch("https://wms.tesla.com/inventory/v1/api/partlocation", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW5pZCI6MSwiZG9tYWlubmFtZSI6IkRlZmF1bHQiLCJleHAiOjE2NTQxODg4MjUsImZpcnN0bmFtZSI6Ik1pbGVzIiwiaG9tZXBhZ2V1cmwiOiIiLCJpYXQiOjE2NTQxMzg0MjUsImlzcyI6InByZCIsImxhbmciOiJlbiIsImxhc3RuYW1lIjoiV2F0c29uIiwibG9jYWxlIjoiZW4tVVMiLCJwcmltYXJ5d2FyZWhvdXNlY2xhc3MiOiJTQyIsInByaW1hcnl3YXJlaG91c2VkZXNjIjoiVGVzbGEgU2VydmljZSBDb3J0ZSBNYWRlcmEiLCJwcmltYXJ5d2FyZWhvdXNlaWQiOjE0NDIsInJvbGVzIjpbIkRDIFdhcmVob3VzZSBMZWFkIiwiUmVhZCBPbmx5IiwiU2VydmljZSBMZWFkIl0sInN1YiI6Im1pbHdhdHNvbiIsInRpbWV6b25lIjoiQW1lcmljYS9Mb3NfQW5nZWxlcyIsInVzZXJpZCI6Mzk5OCwidXQiOjIsIndhcmVob3VzZW5hbWUiOiI1ODk4In0.WcHuv69qhMu5SdIA51mmU-XSpPWlrFyvi_6_N4_OyN_3WbbSSK0Ug-gDNmHsy_9fck7tmhQbIr6WMRrdQUIjn-73yQXTNsO2GEf_bv_5AZy_aJozM0I9Z18OGd-KTC1J3hT9zUipBGxwIxrMgmqHsfBZeOqQfd3NTdo17a11crAeZ9PNbDIKZ1_xpWbkc63cGawVWPZnb56wiKg0jU_op8EJucnlMlPBAhsH5uRRCvs_Lw5xI49J3roJlcbeoXNRPxVlM545MarhGqsFaa1oU7Y1YS6kXb43tn4gY-LBCWCluSJk5kj8nk3HRswBPiYvu7sea6KzYheRMGH4dt0HSHQuHTY3wB80NW42qCpmGntHsQlglWFotlDh-OXFB748YWTkEzQnObmPImoaJhtOAHQI40yv-bD1rWODBPfLG8L9QnUjNqqVf-bzlqV0fMOg1Yr8A_tpUsnOO1k5RNnB4MW1zdd3jyVrCzCcKrV2aj02ojvdQ9te2Z_Xn9MpyEX9d3Q7T8WbnorTMZN_ViGzjZwCilYd3Q0Cwcg9lo8t2QAJbc0ZGX92SVRKbAiDDiI2ngihe6msX9lOAVUpiI6ZWLWkmNre0MlM8nYugqNrC6Y5lD0SMV_bLzB6z-oPrmLU-fnPIP7sH6led64akU2wTwWGsN7H3qNFidOuLCghktE",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "RT=\"z=1&dm=tesla.com&si=efc3f37b-77ef-40c6-9cab-30ddf2b8ffe9&ss=l3nrahv8&sl=0&tt=0\"; _abck=BDFA8FEA888D2BFA08E9DDAA3AF4E162~-1~YAAQzTLFF8/rB/CAAQAATNwYAwdwfPpSr806IktEOj5FJIxFLcdNT1reD8f1+YSTW+zJjEVhk4pLG9o8zhasQv+Ck5sTNMhX95kof+f9v4gSnFevydfvI0hpZs8dUMFA1JrR9eCT4jV3ix4g7Hb2H9D+d0uRCCbpSNa+nnMSmGJMyVihs3kfuv6OygIVVlbAJSrYbmptNVbfSe2LhA4nPqCrPHfu6a7ioWE0RpL6e57hZJjzfYGv6ScsD4bh9vGLITE70cK4uVyGxqDCDDzhEFz73m4lN8MLAJTuPfD/A01xQNnFW0lf87PRBQY+JAMia8FQ/fZHz0iEUETSxyJetlC92jK1GcemY+hbECdxTFiSFhbkFsF4tyhJ+gdjjDFeSSrwXmgUFZuI~-1~-1~-1; _ga_KFP8T9JWYJ=GS1.1.1654139208.2.0.1654139208.0; _ga=GA1.2.2060949509.1652641848; _gid=GA1.2.1274453491.1654139209",
    "Referer": "https://wms.tesla.com/dashboard/inventory/partlocation/create/0",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"checkcapacity\":true,\"allowoverride\":false,\"emptyonly\":false,\"splitpallet\":false,\"allowmixpart\":true,\"warehousename\":\"5898\",\"partname\":\"1042524-00-A\",\"inventorystatusname\":\"Available\",\"sequence\":1,\"zonename\":\"\",\"locationname\":\"S3415-B-17-02-020\",\"partlocationtypename\":\"Storage\",\"maxquantity\":5000,\"maxcontainer\":0}",
  "method": "POST"
});