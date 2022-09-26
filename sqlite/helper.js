export const  OfflineBaskets = [
    {
        basketName: 'Location Visits',
        itemTypes:[
            'checkin',
            'checkout',
            'location_info_feedback',
            'stage_outcome_update',
            'disposition_update',
            'location_image'               
        ]
    },
    {
        basketName: 'Forms',
        itemTypes:[
            'form_submission'            
        ]
    },
    {
        basketName: 'Stock Module',
        itemTypes:[
            'add_stock',
            'sell_to_trader',
            'swop_at_trader',
            'transfer',
            'return_device',
            'return_to_warehouse',
        ]
    },
    {
        basketName: 'Others',
        itemTypes:[
            'location-feedback',
            'other',            
        ]
    }
]


export const OfflineSyncITemTable = [
    {
        "charset":"latin1",
        "collation":"latin1_swedish_ci",
        "engine":"MyISAM",
        "fields":[           
            {
                "name":"id",
                "type":"INTEGER",
                "default":"None",
                "null":"No"
            },
            {
                "name":"indempotency_key",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
               "name":"item_type",
               "type":"TEXT",
               "default":"None",
               "null":"No"
            },
            {
                "name":"item_label",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
                "name":"item_sub_text",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
                "name":"added_time",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
                "name":"added_timezone",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
                "name":"post_body",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
                "name":"url",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            },
            {
                "name":"method",
                "type":"TEXT",
                "default":"None",
                "null":"No"
            }                      
        ],
        "index_keys":[       
            {
                "key_name":"",
                "type":"PRIMARY",
                "fields":["id"]
            }
        ],
        "table_name":"offline_sync_items"
     }
]
