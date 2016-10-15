define({ "api": [
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "SignUp&Login",
    "name": "SignUp_Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Mandatory UserName</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "passowrd",
            "description": "<p>Mandatory Password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"response\": {\n  \"success\": \"true\",\n  \"message\": {\"token\": \"token\"}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/index.js",
    "groupTitle": "Auth",
    "sampleRequest": [
      {
        "url": "https://webrtc-hack.herokuapp.com/api/auth/login"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/packages/add",
    "title": "Add Package",
    "name": "AddPackage",
    "group": "Package",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Mandatory Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Mandatory Description</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "hours",
            "description": "<p>Mandatory Hours</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "devices",
            "description": "<p>Mandatory Number of Devices</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"response\": {\n  \"success\": \"true\",\n  \"message\": {\"package\": \"Package object\"}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/index.js",
    "groupTitle": "Package",
    "sampleRequest": [
      {
        "url": "https://webrtc-hack.herokuapp.com/api/packages/add"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/packages/all",
    "title": "Get All Packages",
    "name": "GetPackages",
    "group": "Package",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"response\": {\n  \"success\": \"true\",\n  \"message\": {\"packages\": \"Array of packages\"}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/index.js",
    "groupTitle": "Package",
    "sampleRequest": [
      {
        "url": "https://webrtc-hack.herokuapp.com/api/packages/all"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/packages/purchase",
    "title": "Purchase Package",
    "name": "PurchasePackage",
    "group": "Package",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"response\": {\n  \"success\": \"true\",\n  \"message\": {\"user\": \"User object\"}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/index.js",
    "groupTitle": "Package",
    "sampleRequest": [
      {
        "url": "https://webrtc-hack.herokuapp.com/api/packages/purchase"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/user/devices/register",
    "title": "Register Device",
    "name": "Register_Device",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Mandatory Device Id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"response\": {\n  \"success\": \"true\",\n  \"message\": {\"user\": \"User Object\"}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/index.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://webrtc-hack.herokuapp.com/api/user/devices/register"
      }
    ]
  }
] });
