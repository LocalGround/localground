
var __projectJSON = {
    "url": "\/api\/0\/projects\/3\/",
    "id": 3,
    "name": "My Second Project (#3)",
    "caption": "Testing two projects",
    "overlay_type": "project",
    "tags": [

    ],
    "owner": "riley",
    "slug": "my-second-project-3",
    "access_authority": 1,
    "sharing_url": "http:\/\/localhost:7777\/api\/0\/projects\/3\/users\/",
    "time_stamp": "2018-01-18T20:44:26",
    "date_created": "2018-01-18T20:44:26",
    "last_updated_by": "riley",
    "datasets": {
      "dataset_3": {
        "dataType": "dataset_3",
        "fields": [
          {
            "id": 11,
            "dataset": 3,
            "col_alias": "Height",
            "col_name": "height",
            "extras": null,
            "is_display_field": false,
            "ordering": 1,
            "data_type": "integer",
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/fields\/11"
          },
          {
            "id": 12,
            "dataset": 3,
            "col_alias": "Square Feet",
            "col_name": "square_feet",
            "extras": null,
            "is_display_field": false,
            "ordering": 2,
            "data_type": "integer",
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/fields\/12"
          },
          {
            "id": 13,
            "dataset": 3,
            "col_alias": "building_name",
            "col_name": "buildingname",
            "extras": null,
            "is_display_field": true,
            "ordering": 3,
            "data_type": "text",
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/fields\/13"
          }
        ],
        "overlay_type": "record",
        "data": [
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/data\/51",
            "id": 51,
            "name": "dog",
            "caption": null,
            "overlay_type": "dataset_3",
            "tags": ["animal", "cat", "cute", "tag1"],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.030210495,
                37.89327929625
              ]
            },
            "extras": null,
            "dataset": 3,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 10,
            "square_feet": 3000,
            "display_name": "post office",
            "buildingname": "post office"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/data\/52",
            "id": 52,
            "name": "cat",
            "caption": null,
            "overlay_type": "dataset_3",
            "tags": ["animal", "dog"],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.18401908875,
                37.726194088706
              ]
            },
            "extras": null,
            "dataset": 3,
            "media": {
              "photos": {
                "overlay_type": "photo",
                "data": [
                  {
                    "url": "\/api\/0\/photos\/20\/",
                    "id": 20,
                    "name": "DSC04705.JPG",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": null,
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "DSC04705.JPG",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705.JPG",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_20.jpg"
                  }
                ],
                "id": "photos",
                "attach_url": "http:\/\/localhost:7777\/api\/0\/markers\/52\/photos\/",
                "name": "Photos"
              }
            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 20,
            "square_feet": 50000,
            "display_name": "Gym",
            "buildingname": "Gym"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/data\/53",
            "id": 53,
            "name": "Frog",
            "caption": null,
            "overlay_type": "dataset_3",
            "tags": ["animal", "amphibian", "cute", "frog"],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -121.92584037781,
                37.739227295123
              ]
            },
            "extras": null,
            "dataset": 3,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 50,
            "square_feet": 70000,
            "display_name": "Costco",
            "buildingname": "Costco"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/data\/54",
            "id": 54,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_3",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  -121.96369696317,
                  37.623792449119
                ],
                [
                  -121.94721747099,
                  37.575918412182
                ],
                [
                  -122.03236151396,
                  37.506228474086
                ],
                [
                  -121.93623114286,
                  37.475718647094
                ],
                [
                  -121.97193670927,
                  37.414661615354
                ]
              ]
            },
            "extras": null,
            "dataset": 3,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 0,
            "square_feet": 0,
            "display_name": "Gym",
            "buildingname": "Gym"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/3\/data\/55",
            "id": 55,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_3",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.83872748075,
                    37.44192537568
                  ],
                  [
                    -121.78379584013,
                    37.566122200968
                  ],
                  [
                    -121.67805243192,
                    37.48116774446
                  ],
                  [
                    -121.83872748075,
                    37.44192537568
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 3,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 0,
            "square_feet": 0,
            "display_name": "Costco",
            "buildingname": "Costco"
          }
        ],
        "name": "Buildings"
      },
      "dataset_2": {
        "dataType": "dataset_2",
        "fields": [
          {
            "id": 8,
            "dataset": 2,
            "col_alias": "Height",
            "col_name": "height",
            "extras": null,
            "is_display_field": false,
            "ordering": 1,
            "data_type": "integer",
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/fields\/8"
          },
          {
            "id": 9,
            "dataset": 2,
            "col_alias": "Type",
            "col_name": "type",
            "extras": null,
            "is_display_field": true,
            "ordering": 2,
            "data_type": "text",
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/fields\/9"
          },
          {
            "id": 10,
            "dataset": 2,
            "col_alias": "Deciduous\/Conifer",
            "col_name": "deciduousconifer",
            "extras": [
              {
                "name": "Deciduous"
              },
              {
                "name": "Conifer"
              }
            ],
            "is_display_field": false,
            "ordering": 3,
            "data_type": "choice",
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/fields\/10"
          }
        ],
        "overlay_type": "record",
        "data": [
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/10",
            "id": 10,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.31663275419,
                38.10623915271
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {
              "photos": {
                "overlay_type": "photo",
                "data": [
                  {
                    "url": "\/api\/0\/photos\/11\/",
                    "id": 11,
                    "name": "DSC04706.JPG",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": null,
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "DSC04706.JPG",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706.JPG",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_20.jpg"
                  }
                ],
                "id": "photos",
                "attach_url": "http:\/\/localhost:7777\/api\/0\/markers\/10\/photos\/",
                "name": "Photos"
              }
            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 30,
            "display_name": "Pine",
            "type": "Pine",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/11",
            "id": 11,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -122.6372051239,
                    38.841846903809
                  ],
                  [
                    -122.26916313171,
                    38.948729392111
                  ],
                  [
                    -122.12908744812,
                    38.776569621479
                  ],
                  [
                    -122.42434501648,
                    38.684973770412
                  ],
                  [
                    -122.6372051239,
                    38.841846903809
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {
              "photos": {
                "overlay_type": "photo",
                "data": [
                  {
                    "url": "\/api\/0\/photos\/4\/",
                    "id": 4,
                    "name": "20160804_112217.jpg",
                    "caption": "",
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -122.29194722222,
                        37.867777777778
                      ]
                    },
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "20160804_112217.jpg",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217.jpg",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_20.jpg"
                  },
                  {
                    "url": "\/api\/0\/photos\/13\/",
                    "id": 13,
                    "name": "DSC04699.JPG",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": null,
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "DSC04699.JPG",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699.JPG",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_20.jpg"
                  },
                  {
                    "url": "\/api\/0\/photos\/7\/",
                    "id": 7,
                    "name": "20160804_141412.jpg",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -122.27166666667,
                        37.854166666667
                      ]
                    },
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "20160804_141412.jpg",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412.jpg",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_20.jpg"
                  },
                  {
                    "url": "\/api\/0\/photos\/14\/",
                    "id": 14,
                    "name": "DSC04710.JPG",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": null,
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "DSC04710.JPG",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710.JPG",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_20.jpg"
                  },
                  {
                    "url": "\/api\/0\/photos\/15\/",
                    "id": 15,
                    "name": "DSC04682.JPG",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": null,
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "DSC04682.JPG",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682.JPG",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_20.jpg"
                  },
                  {
                    "url": "\/api\/0\/photos\/8\/",
                    "id": 8,
                    "name": "20160804_142124.jpg",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -122.27333055556,
                        37.853888888889
                      ]
                    },
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "20160804_142124.jpg",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124.jpg",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_20.jpg"
                  }
                ],
                "id": "photos",
                "attach_url": "http:\/\/localhost:7777\/api\/0\/markers\/11\/photos\/",
                "name": "Photos"
              }
            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 50,
            "display_name": "Spruce",
            "type": "Spruce",
            "deciduousconifer": "Conifer"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/12",
            "id": 12,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.47044134794,
                38.140810120799
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {
              "photos": {
                "overlay_type": "photo",
                "data": [
                  {
                    "url": "\/api\/0\/photos\/6\/",
                    "id": 6,
                    "name": "20160804_135719.jpg",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -122.27305555556,
                        37.856666666667
                      ]
                    },
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "20160804_135719.jpg",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719.jpg",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_20.jpg"
                  },
                  {
                    "url": "\/api\/0\/photos\/11\/",
                    "id": 11,
                    "name": "DSC04706.JPG",
                    "caption": null,
                    "overlay_type": "photo",
                    "tags": [

                    ],
                    "owner": "riley",
                    "project_id": 3,
                    "geometry": null,
                    "extras": null,
                    "attribution": "riley",
                    "media_file": "DSC04706.JPG",
                    "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706.JPG",
                    "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_1000.jpg",
                    "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_500.jpg",
                    "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_250.jpg",
                    "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_128.jpg",
                    "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_50.jpg",
                    "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_20.jpg"
                  }
                ],
                "id": "photos",
                "attach_url": "http:\/\/localhost:7777\/api\/0\/markers\/12\/photos\/",
                "name": "Photos"
              }
            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 21,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/14",
            "id": 14,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -123.08258056641,
                    38.636181912597
                  ],
                  [
                    -122.81478881836,
                    38.395491532972
                  ],
                  [
                    -123.29870223999,
                    38.052416771865
                  ],
                  [
                    -123.57936859131,
                    38.54172095604
                  ],
                  [
                    -123.08258056641,
                    38.636181912597
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 10,
            "display_name": "Maple",
            "type": "Maple",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/15",
            "id": 15,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -122.0804266995,
                    37.813895441503
                  ],
                  [
                    -121.82774115263,
                    37.930972561685
                  ],
                  [
                    -121.81950140653,
                    37.622704744952
                  ],
                  [
                    -122.00901556669,
                    37.685765273719
                  ],
                  [
                    -122.0804266995,
                    37.813895441503
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 25,
            "display_name": "Maple",
            "type": "Maple",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/16",
            "id": 16,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.37156439481,
                37.939637538194
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 60,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/17",
            "id": 17,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 85,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/18",
            "id": 18,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  -122.81890869141,
                  38.777104924285
                ],
                [
                  -122.9328918457,
                  38.98903569863
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 70,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/19",
            "id": 19,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -122.35645819364,
                    38.482393591743
                  ],
                  [
                    -122.16145086942,
                    38.527529927068
                  ],
                  [
                    -122.11475897489,
                    38.415712073652
                  ],
                  [
                    -122.30976629911,
                    38.217455987925
                  ],
                  [
                    -122.37843084989,
                    38.355430658017
                  ],
                  [
                    -122.35645819364,
                    38.482393591743
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 20,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/20",
            "id": 20,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -122.45979309082,
                    38.064040835819
                  ],
                  [
                    -122.4845123291,
                    38.064040835819
                  ],
                  [
                    -122.48279571533,
                    38.048631794487
                  ],
                  [
                    -122.45876312256,
                    38.051605721759
                  ],
                  [
                    -122.47627258301,
                    38.057012552715
                  ],
                  [
                    -122.45979309082,
                    38.064040835819
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 50,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/21",
            "id": 21,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -122.50648498535,
                    37.998327097213
                  ],
                  [
                    -122.4755859375,
                    37.993186501393
                  ],
                  [
                    -122.47661590576,
                    38.06187835907
                  ],
                  [
                    -122.48863220215,
                    38.036734877268
                  ],
                  [
                    -122.48176574707,
                    38.01807445589
                  ],
                  [
                    -122.50648498535,
                    37.998327097213
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 50,
            "display_name": "Oak",
            "type": "Oak",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/36",
            "id": 36,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -121.9746832913,
                38.131088690609
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 0,
            "display_name": "",
            "type": "",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/37",
            "id": 37,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 80,
            "display_name": "",
            "type": "",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/38",
            "id": 38,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  -122.563825137,
                  38.345737887701
                ],
                [
                  -122.62150335966,
                  38.188318468443
                ],
                [
                  -122.77256537138,
                  38.184000807143
                ],
                [
                  -122.74235296903,
                  38.259522924964
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 0,
            "display_name": "",
            "type": "",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/47",
            "id": 47,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.37145996094,
                    39.053318106741
                  ],
                  [
                    -121.48132324219,
                    38.626526838378
                  ],
                  [
                    -121.30554199219,
                    38.741766321755
                  ],
                  [
                    -121.37145996094,
                    39.053318106741
                  ]
                ]
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 55,
            "display_name": "",
            "type": "",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/49",
            "id": 49,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -121.96703910828,
                37.495562779427
              ]
            },
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": null,
            "display_name": "Pine",
            "type": "Pine",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/50",
            "id": 50,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "height": 0,
            "display_name": "Hickory",
            "type": "Hickory",
            "deciduousconifer": "Deciduous"
          },
          {
            "url": "http:\/\/localhost:7777\/api\/0\/datasets\/2\/data\/56",
            "id": 56,
            "name": "",
            "caption": null,
            "overlay_type": "dataset_2",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "dataset": 2,
            "media": {

            },
            "attached_photos_ids": null,
            "attached_audio_ids": null,
            "attached_videos_ids": null,
            "attached_map_images_ids": null,
            "display_name": null
          }
        ],
        "name": "Trees"
      }
    },
    "media": {
      "photos": {
        "dataType": "photos",
        "overlay_type": "photo",
        "data": [
          {
            "url": "\/api\/0\/photos\/21\/",
            "id": 21,
            "name": "IMAG0363.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "IMAG0363.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0363_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/20\/",
            "id": 20,
            "name": "DSC04705.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04705.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04705_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/19\/",
            "id": 19,
            "name": "IMAG0464.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "IMAG0464.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/IMAG0464_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/18\/",
            "id": 18,
            "name": "DSC04677.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04677.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04677_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/17\/",
            "id": 17,
            "name": "20160804_143728.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.27111111111,
                37.856388888889
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_143728.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_143728_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/16\/",
            "id": 16,
            "name": "20160804_150032.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.26611388889,
                37.852777777778
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_150032.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_150032_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/15\/",
            "id": 15,
            "name": "DSC04682.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04682.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04682_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/14\/",
            "id": 14,
            "name": "DSC04710.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04710.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04710_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/13\/",
            "id": 13,
            "name": "DSC04699.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04699.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04699_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/12\/",
            "id": 12,
            "name": "DSC04692.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04692.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04692_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/11\/",
            "id": 11,
            "name": "DSC04706.JPG",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": null,
            "extras": null,
            "attribution": "riley",
            "media_file": "DSC04706.JPG",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706.JPG",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/DSC04706_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/10\/",
            "id": 10,
            "name": "20160804_112541.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                122.2925,
                37.867777777778
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_112541.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112541_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/9\/",
            "id": 9,
            "name": "20160804_112501_001.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.29222222222,
                37.867777777778
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_112501_001.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112501_001_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/8\/",
            "id": 8,
            "name": "20160804_142124.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.27333055556,
                37.853888888889
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_142124.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_142124_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/7\/",
            "id": 7,
            "name": "20160804_141412.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.27166666667,
                37.854166666667
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_141412.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_141412_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/6\/",
            "id": 6,
            "name": "20160804_135719.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.27305555556,
                37.856666666667
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_135719.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_135719_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/5\/",
            "id": 5,
            "name": "20160804_112325.jpg",
            "caption": null,
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.29194722222,
                37.867777777778
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_112325.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112325_20.jpg"
          },
          {
            "url": "\/api\/0\/photos\/4\/",
            "id": 4,
            "name": "20160804_112217.jpg",
            "caption": "",
            "overlay_type": "photo",
            "tags": [

            ],
            "owner": "riley",
            "project_id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -122.29194722222,
                37.867777777778
              ]
            },
            "extras": null,
            "attribution": "riley",
            "media_file": "20160804_112217.jpg",
            "path": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217.jpg",
            "path_large": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_1000.jpg",
            "path_medium": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_500.jpg",
            "path_medium_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_250.jpg",
            "path_small": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_128.jpg",
            "path_marker_lg": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_50.jpg",
            "path_marker_sm": "https:\/\/localground-riley-dev.s3.amazonaws.com\/media\/riley\/photos\/20160804_112217_20.jpg"
          }
        ],
        "name": "Photos"
      },
      "audio": {
            "dataType": "audio",
            "overlay_type": "audio",
            "data": [
                {
                    "id": 4,
                    "name": "fffff",
                    "caption": "",
                    "tags": [],
                    "url": "/api/0/audio/4/",
                    "overlay_type": "audio",
                    "owner": "vanwars",
                    "geometry": null,
                    "project_id": 2,
                    "extras": null,
                    "attribution": "vanwars",
                    "media_file": "tmpjyzaep_uUc4AKm.mp3",
                    "file_path": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmpjyzaep_pfAu5SN.mp3",
                    "file_path_orig": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmpjyzaep_uUc4AKm.mp3"
                },
                {
                    "id": 3,
                    "name": "tmpvpqx0b.mp3",
                    "caption": null,
                    "tags": [],
                    "url": "/api/0/audio/3/",
                    "overlay_type": "audio",
                    "owner": "vanwars",
                    "geometry": null,
                    "project_id": 2,
                    "extras": null,
                    "attribution": "vanwars",
                    "media_file": "tmpvpqx0b_fRQGMtO.mp3",
                    "file_path": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmpvpqx0b_tkPm9ng.mp3",
                    "file_path_orig": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmpvpqx0b_fRQGMtO.mp3"
                },
                {
                    "id": 2,
                    "name": "tmpjyzaep.mp3",
                    "caption": null,
                    "tags": [],
                    "url": "/api/0/audio/2/",
                    "overlay_type": "audio",
                    "owner": "vanwars",
                    "geometry": null,
                    "project_id": 2,
                    "extras": null,
                    "attribution": "vanwars",
                    "media_file": "tmpjyzaep_L7qUNDB.mp3",
                    "file_path": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmpjyzaep_GUVsl5V.mp3",
                    "file_path_orig": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmpjyzaep_L7qUNDB.mp3"
                },
                {
                    "id": 1,
                    "name": "tmprtpaim.mp3",
                    "caption": null,
                    "tags": [],
                    "url": "/api/0/audio/1/",
                    "overlay_type": "audio",
                    "owner": "vanwars",
                    "geometry": null,
                    "project_id": 2,
                    "extras": null,
                    "attribution": "vanwars",
                    "media_file": "tmprtpaim_DdT2vNS.mp3",
                    "file_path": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmprtpaim_yx56f48.mp3",
                    "file_path_orig": "https://localground-test.s3.amazonaws.com/media/vanwars/audio/tmprtpaim_DdT2vNS.mp3"
                }
            ],
            "name": "Audio"
        },
      "videos": {
        "dataType": "videos",
        "overlay_type": "video",
        "data": [
            {
                "id": 53,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/53/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://www.youtube.com/watch?v=FTvZ8a2gHFc&list=PLtRfQThZ9ky9ErkuT2S0XCu-bfaP7jdPZ&index=2",
                "video_id": "FTvZ8a2gHFc",
                "video_provider": "youtube",
                "attribution": null
            },
            {
                "id": 52,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/52/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://vimeo.com/channels/staffpicks/256931635",
                "video_id": "256931635",
                "video_provider": "vimeo",
                "attribution": null
            },
            {
                "id": 51,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/51/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://vimeo.com/channels/staffpicks/256931635",
                "video_id": "256931635",
                "video_provider": "vimeo",
                "attribution": null
            },
            {
                "id": 50,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/50/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://www.youtube.com/watch?list=PLtRfQThZ9ky9ErkuT2S0XCu-bfaP7jdPZ&v=UfcAVejslrU",
                "video_id": "UfcAVejslrU",
                "video_provider": "youtube",
                "attribution": null
            },
            {
                "id": 49,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/49/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://www.youtube.com/watch?list=PLtRfQThZ9ky9ErkuT2S0XCu-bfaP7jdPZ&v=UfcAVejslrU",
                "video_id": "UfcAVejslrU",
                "video_provider": "youtube",
                "attribution": null
            },
            {
                "id": 48,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/48/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://www.youtube.com/watch?v=1t-gK-",
                "video_id": "1t-gK-",
                "video_provider": "youtube",
                "attribution": null
            },
            {
                "id": 47,
                "overlay_type": "video",
                "owner": "vanwars",
                "name": "Untitled",
                "caption": null,
                "tags": [],
                "url": "/api/0/videos/47/",
                "geometry": null,
                "project_id": 2,
                "video_link": "https://www.youtube.com/watch?v=1t-gK-9EIq4&list=RDMM1t-gK-9EIq4",
                "video_id": "1t-gK-9EIq4",
                "video_provider": "youtube",
                "attribution": null
            }
        ],
        "name": "Videos"
      },
      "map_images": {
        "dataType": "map-images",
        "overlay_type": "map_image",
        "data": [
          {
            "url": "\/api\/0\/map-images\/6\/",
            "id": 6,
            "name": "markup-test.png",
            "caption": null,
            "overlay_type": "map-image",
            "tags": [

            ],
            "owner": "riley",
            "source_print": null,
            "project_id": 3,
            "geometry": null,
            "overlay_path": null,
            "media_file": "markup-test.png",
            "file_path": null,
            "file_name": null,
            "uuid": "rtn4ntic",
            "status": 1
          },
          {
            "url": "\/api\/0\/map-images\/5\/",
            "id": 5,
            "name": "markup-test.png",
            "caption": null,
            "overlay_type": "map-image",
            "tags": [

            ],
            "owner": "riley",
            "source_print": 8,
            "project_id": 3,
            "geometry": null,
            "overlay_path": null,
            "media_file": "markup-test.png",
            "file_path": null,
            "file_name": null,
            "uuid": "xn4zp34b",
            "status": 2
          }
        ],
        "name": "Map Images"
      }
    },
    "maps": {
      "dataType": "styled_maps",
      "overlay_type": "styled_map",
      "data": [
        {
          "url": "\/api\/0\/maps\/3\/",
          "id": 3,
          "name": "Map 3",
          "caption": null,
          "overlay_type": "styled_map",
          "tags": [

          ],
          "owner": "riley",
          "slug": "map-3",
          "sharing_url": "map-3",
          "center": {
            "type": "Point",
            "coordinates": [
              -122.24659491239,
              38.08138115948
            ]
          },
          "basemap": 5,
          "zoom": 9,
          "metadata": {
            "displayLegend": true,
            "nextPrevButtons": false,
            "allowPanZoom": true,
            "displayTitleCard": true,
            "titleCardInfo": {
                "header": 'Test Map Title',
                "description": 'Test description of the map.',
                "media": [
                      {
                          "overlay_type": "photo",
                          "id": 20
                      },
                      {
                          "overlay_type": "photo",
                          "id": 19
                      },
                      {
                          "overlay_type": "video",
                          "id": 50
                      },
                      {
                          "overlay_type": "audio",
                          "id": 4
                      },
                      {
                          "overlay_type": "audio",
                          "id": 3
                      }
                  ]
            },
            "streetview": true,
            "accessLevel": 2
          },
          "panel_styles": {
            "display_legend": true,
            "paragraph": {
              "fw": "regular",
              "color": "666",
              "backgroundColor": "f0f1f5",
              "font": "Lato",
              "type": "paragraph",
              "size": "12"
            },
            "subtitle": {
              "fw": "regular",
              "color": "666",
              "backgroundColor": "f7f7f7",
              "font": "Lato",
              "type": "subtitle",
              "size": "12"
            },
            "tags": {
              "fw": "regular",
              "color": "3d3d3d",
              "backgroundColor": "f7f7f7",
              "font": "Lato",
              "type": "tags",
              "size": "10"
            },
            "title": {
              "fw": "bold",
              "color": "ffffff",
              "backgroundColor": "4e70d4",
              "font": "Lato",
              "type": "title",
              "size": "15"
            }
          },
          "project_id": 3
      }, {
          "url": "\/api\/0\/maps\/2\/",
          "id": 2,
          "name": "Map 2",
          "caption": null,
          "overlay_type": "styled_map",
          "tags": [

          ],
          "owner": "riley",
          "slug": "map-2",
          "sharing_url": "map-2",
          "center": {
            "type": "Point",
            "coordinates": [
              -122.51232672392,
              37.964002307916
            ]
          },
          "basemap": 5,
          "zoom": 12,
          "metadata": {
            "displayLegend": true,
            "nextPrevButtons": false,
            "allowPanZoom": true,
            "displayTitleCard": true,
            "titleCardInfo": {
                "header": null,
                "description": null,
                "media": []
            },
            "streetview": true,
            "accessLevel": 2
          },
          "panel_styles": {
            "display_legend": true,
            "title": {
              "fw": "bold",
              "color": "ffffff",
              "backgroundColor": "4e70d4",
              "font": "Lato",
              "type": "title",
              "size": "15"
            },
            "paragraph": {
              "fw": "regular",
              "color": "666",
              "backgroundColor": "f0f1f5",
              "font": "Lato",
              "type": "paragraph",
              "size": "12"
            },
            "subtitle": {
              "fw": "regular",
              "color": "666",
              "backgroundColor": "f7f7f7",
              "font": "Lato",
              "type": "subtitle",
              "size": "12"
            },
            "tags": {
              "fw": "regular",
              "color": "3d3d3d",
              "backgroundColor": "f7f7f7",
              "font": "Lato",
              "type": "tags",
              "size": "10"
            }
          },
          "project_id": 3
        }
      ],
      "name": "Styled_Maps"
    }
  }
