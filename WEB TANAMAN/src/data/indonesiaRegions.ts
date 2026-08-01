export interface Province {
  id: string;
  name: string;
  cities: string[];
}

export const indonesiaProvinces: Province[] = [
  {
    id: "aceh",
    name: "Aceh",
    cities: [
      "Kota Banda Aceh", "Kota Sabang", "Kota Lhokseumawe", "Kota Langsa", "Kota Subulussalam",
      "Kabupaten Aceh Besar", "Kabupaten Aceh Utara", "Kabupaten Aceh Timur", "Kabupaten Aceh Selatan",
      "Kabupaten Aceh Barat", "Kabupaten Bireuen", "Kabupaten Pidie", "Kabupaten Pidie Jaya",
      "Kabupaten Aceh Singkil", "Kabupaten Aceh Tenggara", "Kabupaten Gayo Lues", "Kabupaten Bener Meriah",
      "Kabupaten Aceh Tengah", "Kabupaten Aceh Barat Daya", "Kabupaten Nagan Raya", "Kabupaten Aceh Jaya",
      "Kabupaten Simeulue", "Kabupaten Aceh Tamiang"
    ]
  },
  {
    id: "sumut",
    name: "Sumatera Utara",
    cities: [
      "Kota Medan", "Kota Binjai", "Kota Tebing Tinggi", "Kota Pematangsiantar", "Kota Tanjungbalai",
      "Kota Sibolga", "Kota Padangsidimpuan", "Kota Gunungsitoli", "Kabupaten Deli Serdang",
      "Kabupaten Langkat", "Kabupaten Karo", "Kabupaten Simalungun", "Kabupaten Asahan",
      "Kabupaten Labuhanbatu", "Kabupaten Tapanuli Utara", "Kabupaten Tapanuli Tengah", "Kabupaten Tapanuli Selatan",
      "Kabupaten Nias", "Kabupaten Dairi", "Kabupaten Toba", "Kabupaten Samosir", "Kabupaten Humbang Hasundutan",
      "Kabupaten Pakpak Bharat", "Kabupaten Serdang Bedagai", "Kabupaten Batubara", "Kabupaten Padang Lawas",
      "Kabupaten Padang Lawas Utara", "Kabupaten Labuhanbatu Selatan", "Kabupaten Labuhanbatu Utara",
      "Kabupaten Nias Barat", "Kabupaten Nias Utara", "Kabupaten Nias Selatan"
    ]
  },
  {
    id: "sumbar",
    name: "Sumatera Barat",
    cities: [
      "Kota Padang", "Kota Bukittinggi", "Kota Payakumbuh", "Kota Solok", "Kota Sawahlunto",
      "Kota Padang Panjang", "Kota Pariaman", "Kabupaten Pesisir Selatan", "Kabupaten Solok",
      "Kabupaten Sijunjung", "Kabupaten Tanah Datar", "Kabupaten Padang Pariaman", "Kabupaten Agam",
      "Kabupaten Lima Puluh Kota", "Kabupaten Pasaman", "Kabupaten Kepulauan Mentawai", "Kabupaten Dharmasraya",
      "Kabupaten Solok Selatan", "Kabupaten Pasaman Barat"
    ]
  },
  {
    id: "riau",
    name: "Riau",
    cities: [
      "Kota Pekanbaru", "Kota Dumai", "Kabupaten Kampar", "Kabupaten Indragiri Hulu", "Kabupaten Bengkalis",
      "Kabupaten Indragiri Hilir", "Kabupaten Pelalawan", "Kabupaten Rokan Hulu", "Kabupaten Rokan Hilir",
      "Kabupaten Siak", "Kabupaten Kuantan Singingi", "Kabupaten Kepulauan Meranti"
    ]
  },
  {
    id: "kepri",
    name: "Kepulauan Riau",
    cities: [
      "Kota Batam", "Kota Tanjungpinang", "Kabupaten Bintan", "Kabupaten Karimun",
      "Kabupaten Natuna", "Kabupaten Kepulauan Anambas", "Kabupaten Lingga"
    ]
  },
  {
    id: "jambi",
    name: "Jambi",
    cities: [
      "Kota Jambi", "Kota Sungai Penuh", "Kabupaten Muaro Jambi", "Kabupaten Batanghari",
      "Kabupaten Tanjung Jabung Barat", "Kabupaten Tanjung Jabung Timur", "Kabupaten Bungo",
      "Kabupaten Tebo", "Kabupaten Merangin", "Kabupaten Sarolangun", "Kabupaten Kerinci"
    ]
  },
  {
    id: "sumsel",
    name: "Sumatera Selatan",
    cities: [
      "Kota Palembang", "Kota Lubuklinggau", "Kota Pagar Alam", "Kota Prabumulih",
      "Kabupaten Ogan Komering Ulu", "Kabupaten Ogan Komering Ilir", "Kabupaten Muara Enim",
      "Kabupaten Lahat", "Kabupaten Musi Rawas", "Kabupaten Musi Banyuasin", "Kabupaten Banyuasin",
      "Kabupaten Ogan Komering Ulu Timur", "Kabupaten Ogan Komering Ulu Selatan", "Kabupaten Ogan Ilir",
      "Kabupaten Empat Lawang", "Kabupaten Penukal Abab Lematang Ilir", "Kabupaten Musi Rawas Utara"
    ]
  },
  {
    id: "babel",
    name: "Bangka Belitung",
    cities: [
      "Kota Pangkalpinang", "Kabupaten Bangka", "Kabupaten Bangka Barat", "Kabupaten Bangka Tengah",
      "Kabupaten Bangka Selatan", "Kabupaten Belitung", "Kabupaten Belitung Timur"
    ]
  },
  {
    id: "bengkulu",
    name: "Bengkulu",
    cities: [
      "Kota Bengkulu", "Kabupaten Rejang Lebong", "Kabupaten Bengkulu Utara", "Kabupaten Bengkulu Selatan",
      "Kabupaten Seluma", "Kabupaten Kaur", "Kabupaten Bengkulu Tengah", "Kabupaten Kepahiang",
      "Kabupaten Lebong", "Kabupaten Mukomuko"
    ]
  },
  {
    id: "lampung",
    name: "Lampung",
    cities: [
      "Kota Bandar Lampung", "Kota Metro", "Kabupaten Lampung Selatan", "Kabupaten Lampung Tengah",
      "Kabupaten Lampung Utara", "Kabupaten Lampung Barat", "Kabupaten Tulang Bawang",
      "Kabupaten Tanggamus", "Kabupaten Pesawaran", "Kabupaten Pringsewu", "Kabupaten Mesuji",
      "Kabupaten Tulang Bawang Barat", "Kabupaten Pesisir Barat", "Kabupaten Way Kanan", "Kabupaten Lampung Timur"
    ]
  },
  {
    id: "dki",
    name: "DKI Jakarta",
    cities: [
      "Kota Jakarta Pusat", "Kota Jakarta Selatan", "Kota Jakarta Barat", "Kota Jakarta Utara",
      "Kota Jakarta Timur", "Kabupaten Kepulauan Seribu"
    ]
  },
  {
    id: "jabar",
    name: "Jawa Barat",
    cities: [
      "Kota Bandung", "Kota Bogor", "Kota Depok", "Kota Bekasi", "Kota Tasikmalaya", "Kota Cimahi",
      "Kota Cirebon", "Kota Sukabumi", "Kota Banjar", "Kabupaten Bogor", "Kabupaten Sukabumi",
      "Kabupaten Cianjur", "Kabupaten Bandung", "Kabupaten Bandung Barat", "Kabupaten Garut",
      "Kabupaten Tasikmalaya", "Kabupaten Ciamis", "Kabupaten Kuningan", "Kabupaten Cirebon",
      "Kabupaten Majalengka", "Kabupaten Sumedang", "Kabupaten Indramayu", "Kabupaten Subang",
      "Kabupaten Purwakarta", "Kabupaten Karawang", "Kabupaten Bekasi", "Kabupaten Pangandaran"
    ]
  },
  {
    id: "jateng",
    name: "Jawa Tengah",
    cities: [
      "Kota Semarang", "Kota Surakarta (Solo)", "Kota Magelang", "Kota Salatiga", "Kota Pekalongan",
      "Kota Tegal", "Kabupaten Cilacap", "Kabupaten Banyumas", "Kabupaten Purbalingga", "Kabupaten Banjarnegara",
      "Kabupaten Kebumen", "Kabupaten Purworejo", "Kabupaten Wonosobo", "Kabupaten Magelang",
      "Kabupaten Boyolali", "Kabupaten Klaten", "Kabupaten Sukoharjo", "Kabupaten Karanganyar",
      "Kabupaten Wonogiri", "Kabupaten Sragen", "Kabupaten Grobogan", "Kabupaten Blora",
      "Kabupaten Rembang", "Kabupaten Pati", "Kabupaten Kudus", "Kabupaten Jepara",
      "Kabupaten Demak", "Kabupaten Semarang", "Kabupaten Temanggung", "Kabupaten Kendal",
      "Kabupaten Batang", "Kabupaten Pekalongan", "Kabupaten Pemalang", "Kabupaten Tegal", "Kabupaten Brebes"
    ]
  },
  {
    id: "diy",
    name: "DI Yogyakarta",
    cities: [
      "Kota Yogyakarta", "Kabupaten Sleman", "Kabupaten Bantul", "Kabupaten Gunungkidul", "Kabupaten Kulon Progo"
    ]
  },
  {
    id: "jatim",
    name: "Jawa Timur",
    cities: [
      "Kota Surabaya", "Kota Malang", "Kota Batu", "Kota Kediri", "Kota Blitar", "Kota Madiun",
      "Kota Probolinggo", "Kota Pasuruan", "Kota Mojokerto", "Kabupaten Sidoarjo", "Kabupaten Gresik",
      "Kabupaten Mojokerto", "Kabupaten Pasuruan", "Kabupaten Probolinggo", "Kabupaten Bondowoso",
      "Kabupaten Situbondo", "Kabupaten Banyuwangi", "Kabupaten Jember", "Kabupaten Lumajang",
      "Kabupaten Malang", "Kabupaten Kediri", "Kabupaten Blitar", "Kabupaten Tulangagung",
      "Kabupaten Nganjuk", "Kabupaten Trenggalek", "Kabupaten Ponorogo", "Kabupaten Pacitan",
      "Kabupaten Madiun", "Kabupaten Magetan", "Kabupaten Ngawi", "Kabupaten Bojonegoro",
      "Kabupaten Tuban", "Kabupaten Lamongan", "Kabupaten Bangkalan", "Kabupaten Sampang",
      "Kabupaten Pamekasan", "Kabupaten Sumenep"
    ]
  },
  {
    id: "banten",
    name: "Banten",
    cities: [
      "Kota Tangerang", "Kota Tangerang Selatan", "Kota Serang", "Kota Cilegon",
      "Kabupaten Tangerang", "Kabupaten Serang", "Kabupaten Pandeglang", "Kabupaten Lebak"
    ]
  },
  {
    id: "bali",
    name: "Bali",
    cities: [
      "Kota Denpasar", "Kabupaten Badung", "Kabupaten Gianyar", "Kabupaten Tabanan",
      "Kabupaten Buleleng", "Kabupaten Karangasem", "Kabupaten Klungkung", "Kabupaten Bangli", "Kabupaten Jembrana"
    ]
  },
  {
    id: "ntb",
    name: "Nusa Tenggara Barat",
    cities: [
      "Kota Mataram", "Kota Bima", "Kabupaten Lombok Barat", "Kabupaten Lombok Tengah",
      "Kabupaten Lombok Timur", "Kabupaten Lombok Utara", "Kabupaten Sumbawa", "Kabupaten Sumbawa Barat",
      "Kabupaten Dompu", "Kabupaten Bima"
    ]
  },
  {
    id: "ntt",
    name: "Nusa Tenggara Timur",
    cities: [
      "Kota Kupang", "Kabupaten Kupang", "Kabupaten Timor Tengah Selatan", "Kabupaten Timor Tengah Utara",
      "Kabupaten Belu", "Kabupaten Alor", "Kabupaten Flores Timur", "Kabupaten Sikka", "Kabupaten Ende",
      "Kabupaten Ngada", "Kabupaten Manggarai", "Kabupaten Sumba Barat", "Kabupaten Sumba Timur",
      "Kabupaten Rote Ndao", "Kabupaten Manggarai Barat", "Kabupaten Nagekeo", "Kabupaten Sumba Tengah",
      "Kabupaten Sumba Barat Daya", "Kabupaten Manggarai Timur", "Kabupaten Sabu Raijua", "Kabupaten Malaka"
    ]
  },
  {
    id: "kalbar",
    name: "Kalimantan Barat",
    cities: [
      "Kota Pontianak", "Kota Singkawang", "Kabupaten Kubu Raya", "Kabupaten Mempawah",
      "Kabupaten Sambas", "Kabupaten Bengkayang", "Kabupaten Landak", "Kabupaten Sanggau",
      "Kabupaten Sekadau", "Kabupaten Sintang", "Kabupaten Melawi", "Kabupaten Kapuas Hulu",
      "Kabupaten Ketapang", "Kabupaten Kayong Utara"
    ]
  },
  {
    id: "kalteng",
    name: "Kalimantan Tengah",
    cities: [
      "Kota Palangka Raya", "Kabupaten Kapuas", "Kabupaten Barito Selatan", "Kabupaten Barito Utara",
      "Kabupaten Kotawaringin Timur", "Kabupaten Kotawaringin Barat", "Kabupaten Katingan",
      "Kabupaten Seruyan", "Kabupaten Sukamara", "Kabupaten Lamandau", "Kabupaten Gunung Mas",
      "Kabupaten Pulang Pisau", "Kabupaten Murung Raya", "Kabupaten Barito Timur"
    ]
  },
  {
    id: "kalsel",
    name: "Kalimantan Selatan",
    cities: [
      "Kota Banjarmasin", "Kota Banjarbaru", "Kabupaten Banjar", "Kabupaten Tanah Laut",
      "Kabupaten Barito Kuala", "Kabupaten Tapin", "Kabupaten Hulu Sungai Selatan",
      "Kabupaten Hulu Sungai Tengah", "Kabupaten Hulu Sungai Utara", "Kabupaten Tabalong",
      "Kabupaten Kotabaru", "Kabupaten Tanah Bumbu", "Kabupaten Balangan"
    ]
  },
  {
    id: "kaltim",
    name: "Kalimantan Timur",
    cities: [
      "Kota Samarinda", "Kota Balikpapan", "Kota Bontang", "Kabupaten Kutai Kartanegara",
      "Kabupaten Kutai Timur", "Kabupaten Kutai Barat", "Kabupaten Paser", "Kabupaten Penajam Paser Utara",
      "Kabupaten Berau", "Kabupaten Mahakam Ulu"
    ]
  },
  {
    id: "kaltara",
    name: "Kalimantan Utara",
    cities: [
      "Kota Tarakan", "Kabupaten Bulungan", "Kabupaten Malinau", "Kabupaten Nunukan", "Kabupaten Tana Tidung"
    ]
  },
  {
    id: "sulut",
    name: "Sulawesi Utara",
    cities: [
      "Kota Manado", "Kota Tomohon", "Kota Bitung", "Kota Kotamobagu", "Kabupaten Minahasa",
      "Kabupaten Minahasa Utara", "Kabupaten Minahasa Selatan", "Kabupaten Minahasa Tenggara",
      "Kabupaten Bolaang Mongondow", "Kabupaten Bolaang Mongondow Utara", "Kabupaten Bolaang Mongondow Selatan",
      "Kabupaten Bolaang Mongondow Timur", "Kabupaten Kepulauan Sangihe", "Kabupaten Kepulauan Talaud",
      "Kabupaten Kepulauan Siau Tagulandang Biaro"
    ]
  },
  {
    id: "sulteng",
    name: "Sulawesi Tengah",
    cities: [
      "Kota Palu", "Kabupaten Donggala", "Kabupaten Sigi", "Kabupaten Parigi Moutong",
      "Kabupaten Poso", "Kabupaten Tojo Una-Una", "Kabupaten Banggai", "Kabupaten Banggai Kepulauan",
      "Kabupaten Banggai Laut", "Kabupaten Morowali", "Kabupaten Morowali Utara", "Kabupaten Tolitoli",
      "Kabupaten Buol"
    ]
  },
  {
    id: "sulsel",
    name: "Sulawesi Selatan",
    cities: [
      "Kota Makassar", "Kota Parepare", "Kota Palopo", "Kabupaten Gowa", "Kabupaten Maros",
      "Kabupaten Pangkajene dan Kepulauan", "Kabupaten Barru", "Kabupaten Bone", "Kabupaten Soppeng",
      "Kabupaten Wajo", "Kabupaten Bulukumba", "Kabupaten Bantaeng", "Kabupaten Jeneponto",
      "Kabupaten Takalar", "Kabupaten Sinjai", "Kabupaten Selayar", "Kabupaten Pinrang",
      "Kabupaten Sidrap", "Kabupaten Enrekang", "Kabupaten Tana Toraja", "Kabupaten Toraja Utara",
      "Kabupaten Luwu", "Kabupaten Luwu Utara", "Kabupaten Luwu Timur"
    ]
  },
  {
    id: "sultra",
    name: "Sulawesi Tenggara",
    cities: [
      "Kota Kendari", "Kota Bau-Bau", "Kabupaten Konawe", "Kabupaten Konawe Selatan",
      "Kabupaten Konawe Utara", "Kabupaten Konawe Kepulauan", "Kabupaten Kolaka", "Kabupaten Kolaka Utara",
      "Kabupaten Kolaka Timur", "Kabupaten Bombana", "Kabupaten Muna", "Kabupaten Muna Barat",
      "Kabupaten Buton", "Kabupaten Buton Utara", "Kabupaten Buton Selatan", "Kabupaten Buton Tengah",
      "Kabupaten Wakatobi"
    ]
  },
  {
    id: "gorontalo",
    name: "Gorontalo",
    cities: [
      "Kota Gorontalo", "Kabupaten Gorontalo", "Kabupaten Gorontalo Utara", "Kabupaten Boalemo",
      "Kabupaten Pohuwato", "Kabupaten Bone Bolango"
    ]
  },
  {
    id: "sulbar",
    name: "Sulawesi Barat",
    cities: [
      "Kabupaten Mamuju", "Kabupaten Mamuju Tengah", "Kabupaten Pasangkayu", "Kabupaten Polewali Mandar",
      "Kabupaten Majene", "Kabupaten Mamasa"
    ]
  },
  {
    id: "maluku",
    name: "Maluku",
    cities: [
      "Kota Ambon", "Kota Tual", "Kabupaten Maluku Tengah", "Kabupaten Maluku Tenggara",
      "Kabupaten Maluku Barat Daya", "Kabupaten Kepulauan Tanimbar", "Kabupaten Seram Bagian Barat",
      "Kabupaten Seram Bagian Timur", "Kabupaten Buru", "Kabupaten Buru Selatan", "Kabupaten Kepulauan Aru"
    ]
  },
  {
    id: "malut",
    name: "Maluku Utara",
    cities: [
      "Kota Ternate", "Kota Tidore Kepulauan", "Kabupaten Halmahera Barat", "Kabupaten Halmahera Utara",
      "Kabupaten Halmahera Tengah", "Kabupaten Halmahera Timur", "Kabupaten Halmahera Selatan",
      "Kabupaten Kepulauan Sula", "Kabupaten Pulau Morotai", "Kabupaten Pulau Taliabu"
    ]
  },
  {
    id: "papua",
    name: "Papua",
    cities: [
      "Kota Jayapura", "Kabupaten Jayapura", "Kabupaten Keerom", "Kabupaten Sarmi",
      "Kabupaten Mamberamo Raya", "Kabupaten Biak Numfor", "Kabupaten Supiori", "Kabupaten Kepulauan Yapen",
      "Kabupaten Waropen"
    ]
  },
  {
    id: "papuabarat",
    name: "Papua Barat",
    cities: [
      "Kabupaten Manokwari", "Kabupaten Manokwari Selatan", "Kabupaten Pegunungan Arfak",
      "Kabupaten Teluk Bintuni", "Kabupaten Teluk Wondama", "Kabupaten Kaimana", "Kabupaten Fakfak"
    ]
  },
  {
    id: "papuabaratdaya",
    name: "Papua Barat Daya",
    cities: [
      "Kota Sorong", "Kabupaten Sorong", "Kabupaten Sorong Selatan", "Kabupaten Raja Ampat",
      "Kabupaten Maybrat", "Kabupaten Tambrauw"
    ]
  },
  {
    id: "papuatengah",
    name: "Papua Tengah",
    cities: [
      "Kabupaten Nabire", "Kabupaten Mimika", "Kabupaten Paniai", "Kabupaten Dogiyai",
      "Kabupaten Deiyai", "Kabupaten Intan Jaya", "Kabupaten Puncak", "Kabupaten Puncak Jaya"
    ]
  },
  {
    id: "papuapegunungan",
    name: "Papua Pegunungan",
    cities: [
      "Kabupaten Jayawijaya", "Kabupaten Lanny Jaya", "Kabupaten Tolikara", "Kabupaten Yahukimo",
      "Kabupaten Yalimo", "Kabupaten Pegunungan Bintang", "Kabupaten Nduga", "Kabupaten Mamberamo Tengah"
    ]
  },
  {
    id: "papuaselatan",
    name: "Papua Selatan",
    cities: [
      "Kabupaten Merauke", "Kabupaten Boven Digoel", "Kabupaten Mappi", "Kabupaten Asmat"
    ]
  }
];

export interface ShippingMethod {
  id: string;
  name: string;
  courier: string;
  service: string;
  cost: number;
  etd: string; // Estimated time of delivery
  isCod: boolean;
}

export const shippingMethods: ShippingMethod[] = [
  { id: "jne-reg", name: "JNE Reguler (REG)", courier: "JNE", service: "Reguler (REG)", cost: 24000, etd: "2-3 Hari", isCod: false },
  { id: "jne-yes", name: "JNE Yakin Esok Sampai (YES)", courier: "JNE", service: "Yakin Esok Sampai (YES)", cost: 42000, etd: "1 Hari (Besok Sampai)", isCod: false },
  { id: "jne-oke", name: "JNE Ongkos Kirim Ekonomis (OKE)", courier: "JNE", service: "Ekonomis (OKE)", cost: 18000, etd: "4-5 Hari", isCod: false },
  { id: "jnt-ez", name: "J&T EZ (Reguler)", courier: "J&T Express", service: "EZ (Reguler)", cost: 22000, etd: "2-3 Hari", isCod: false },
  { id: "jnt-super", name: "J&T Super (Sangat Cepat)", courier: "J&T Express", service: "Super", cost: 38000, etd: "1-2 Hari", isCod: false },
  { id: "sicepat-halu", name: "SiCepat HALU (Hemat)", courier: "SiCepat", service: "HALU (Hemat)", cost: 15000, etd: "3-5 Hari", isCod: false },
  { id: "sicepat-reg", name: "SiCepat Reguler (REG)", courier: "SiCepat", service: "Reguler", cost: 23000, etd: "2-3 Hari", isCod: false },
  { id: "pos-kilat", name: "POS Indonesia Kilat Khusus", courier: "POS Indonesia", service: "Kilat Khusus", cost: 19000, etd: "3-4 Hari", isCod: false },
  { id: "pos-nextday", name: "POS Indonesia Nextday", courier: "POS Indonesia", service: "Nextday", cost: 36000, etd: "1 Hari", isCod: false },
  { id: "tiki-reg", name: "TIKI Reguler (REG)", courier: "TIKI", service: "Reguler", cost: 21000, etd: "2-4 Hari", isCod: false },
  { id: "tiki-ons", name: "TIKI Over Night Service (ONS)", courier: "TIKI", service: "Over Night Service", cost: 40000, etd: "1 Hari", isCod: false },
  { id: "gosend-instant", name: "GoSend Instant (Sameday/Instant)", courier: "GoSend", service: "Instant", cost: 45000, etd: "3-6 Jam", isCod: false },
  { id: "grab-instant", name: "GrabExpress Instant", courier: "GrabExpress", service: "Instant", cost: 46000, etd: "3-6 Jam", isCod: false },
  { id: "cod-store-courier", name: "COD - Kurir Toko FloraPremium (Bayar di Tempat)", courier: "COD Kurir Toko", service: "Cash on Delivery", cost: 15000, etd: "1-2 Hari", isCod: true }
];
