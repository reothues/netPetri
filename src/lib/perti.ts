let x= {
  "id":"MC44MDI2Nw==",
  "startAt":"0",
  "places":[
    {
      "from":[
        {
          "from":[],
          "to":["this.places[0]"],
          "name":"start point",
          "type":"Transition"
        },{
          "from":["this.places[0]"],
          "to":["this.places[0]"],
          "name":"new transition",
          "type":"Transition"
        }],
      "to":[
        "this.places[0].from[1]",
        {
          "from":["this.places[0]"],
          "to":[{
            "from":["this.places[0].to[1]"],
            "to":[],
            "name":"new place",
            "type":"Place"
          }],
          "name":"a",
          "type":"Transition"
        }],
        "name":"default",
        "type":"Place"
    },
    "this.places[0].to[1].to[0]"
  ],
  "transitions":[
    "this.places[0].from[0]",
    "this.places[0].from[1]",
    "this.places[0].to[1]"
  ]
}

