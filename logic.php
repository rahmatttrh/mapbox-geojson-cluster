<?php 

        public $long, $lat;
    public $geoJsonSite;
    private function loadLocSite()
    {
        $orders = Order::where('status', 3)->orWhere('status', 4)->orWhere('status', 5)->orWhere('status', 6)->orWhere('status', 7)->orWhere('status', 8)->orWhere('status', 9)->get();

        $customLocSite = [];

        foreach ($orders as $order) {

            if ($order->status == 3) {
                $status = 'Menuggu Kordinator';
            } elseif ($order->status == 4) {
                $status = 'Menunggu Teknisi';
            } elseif ($order->status == 5) {
                $status = 'On Progress';
            } elseif ($order->status == 6) {
                $status = 'Order Report';
            } elseif ($order->status == 7) {
                $status = 'Order Bast';
            } elseif ($order->status == 8) {
                $status = 'Ready to Payment';
            } elseif ($order->status == 9) {
                $status = 'Order Complete';
            }
            
            $customLocSite[] = [
                'type' => 'Feature',
                'geometry' => [
                    'coordinates' => [$order->longitude, $order->latitude],
                    'type' => 'Point'
                ],
                'properties' => [
                    'locationId' => $order->id,
                    'title' => $order->site,
                    'client' => $order->pelanggan->nama,
                    'kordinator' => $order->kordinator ? $order->kordinator->nama : '',
                    'image' => $order->kordinator ? $order->kordinator->foto_diri : '',
                    'kabupaten' => $order->kabupaten,
                    'provinsi' => $order->provinsi,
                    'lat' => $order->latitude,
                    'long' => $order->longitude,
                    'desc' => $status
                ]
            ];
        }

        $geoLocationSite = [
            'type' => 'featureCollection',
            'features' => $customLocSite
        ];
        $geoJsonSite = collect($geoLocationSite)->toJson();
        $this->geoJsonSite = $geoJsonSite;
    }

 ?>