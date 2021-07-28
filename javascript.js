<script>
      const defaultLocation = [114.59075, -3.31987]
      mapboxgl.accessToken = 'pk.eyJ1IjoicmFobWF0cmgiLCJhIjoiY2tqZHBvaWUxNWg2cTJxcndraHQ0bHNxMyJ9.AO_Soy7dCqnCy6ZnC9mNKA';
      var map = new mapboxgl.Map({
        container: 'map',
        center: defaultLocation,
        zoom: 4.4,
      });

      map.on('load', function () {

            map.addSource('site', {
                type: 'geojson',
                data: {!! $geoJsonSite !!},
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
                
            });

            map.addLayer({
                id: 'clusters', 
                type: 'circle',
                source: 'site',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'site',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'site',
                filter: ['!', ['has', 'point_count']],

                paint: {
                      'circle-color': [
                        'match',
                        ['get', 'desc'],
                        'Menuggu Kordinator',
                        '#B2B1B9',
                        'Menunggu Teknisi',
                        '#595260',
                        'On Progress',
                        '#185ADB',
                        'Order Report',
                        '#FAAD80',
                        'Order Bast',
                        '#FFF338',
                        'Ready to Payment',
                        '#01937C',
                        'Order Complete',
                        '#2B2B2B',

                        
                        
                        /* other */ '#000'
                      ],
                    'circle-radius': 8,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#66DE93'
                }
            });

            map.on('click', 'clusters', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                var clusterId = features[0].properties.cluster_id;
                map.getSource('site').getClusterExpansionZoom(
                    clusterId,
                    function (err, zoom) {
                        if (err) return;

                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    }
                );
            });


            map.on('click', 'unclustered-point', function (e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var nama = e.features[0].properties.title;
                var client = e.features[0].properties.client;
                var kordinator = e.features[0].properties.kordinator;
                var status = e.features[0].properties.status;
                var lat = e.features[0].properties.lat;
                var long = e.features[0].properties.long;
                var desc = e.features[0].properties.desc;

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        "Site Order<hr><span class='font-bold'>" + nama +"</span><hr>Client : "+client+"<br>Kordinator : "+kordinator+"<br>Lat : "+lat+"<br>Long : "+long+"<hr><span class='font-bold'>"+desc+"</span"
                    )
                    .addTo(map);
            });

            map.on('mouseenter', 'clusters', function () {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', function () {
                map.getCanvas().style.cursor = '';
            });
        });

     

      map.setStyle('mapbox://styles/mapbox/outdoors-v11')
      map.addControl(new mapboxgl.NavigationControl())
   
      </script>