{
    "app_constants":{
      "APP_VERSION" : "0.2.0",
      "EXAMPLE_PATH": "static/examples/",
      "CSS_PATHS":{
        "RULES_CSS": "static/css/rules.css",
        "USLM_CSS": "static/css/uslm.css"
      }
    },
      "SAMPLE_DOCS" : [{
        "type" : "cfr",
        "name": "CFR",
        "css": "USLM_CSS",
        "paths": {
            "left": "CFR/2016-ch3-after113-235.xml",
            "right": "CFR/2018-ch3-after113-235.xml"
            }
        },{
            "type" : "uscode",
            "name": "US CODE",
            "css": "USLM_CSS",
            "paths": {
                "left": "t44-ch3/usc44-ch3-before113-235.xml",
                "right": "t44-ch3/usc44-ch3-after113-235.xml"
                }
            },
            {
            "type" : "bill",
            "name": "114hr766",
            "paths": {
                    "left": "BILLS-114hr766/BILLS-114hr766ih.xml",
                    "right": "BILLS-114hr766/BILLS-114hr766rh.xml"
                },
                "css": "USLM_CSS"
            },
            {
                "name": "114hr50",
                "paths":{
                    "left": "BILLS-114hr50/BILLS-114hr50rh.xml",
                    "right": "BILLS-114hr50/BILLS-114hr50rfs.xml"
                },
                "css": "USLM_CSS"
            },
            {
                "name": "House Rules",
                "paths":{
                    "left": "HouseRules/Rules113content.html",
                    "right": "HouseRules/Rules114content.html"
                },
                "css": "RULES_CSS"
            }
      ]
}
