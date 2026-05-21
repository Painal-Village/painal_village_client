export interface PoliticalLeader {
  name: string;
  englishName: string;
  position: string;
  imageUrl: string;
  place: string;
  hindiPlace?: string;
}

export const currentLeaders: PoliticalLeader[] = [
  {
    name: "अनीता कुमारी",
    englishName: "Anita Kumari",
    position: "मुखिया",
    imageUrl: "",
    place: "Painal",
    hindiPlace: "पाइनल",
  },
  {
    name: "बाबिता कुमारी",
    englishName: "Babita Kumari",
    position: "सरपंच",
    imageUrl:
      "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340706619.webp",
    place: "Painal",
    hindiPlace: "पाइनल",
  },
  {
    name: "दीपू कुमार",
    englishName: "Dipu Kumar",
    position: "पैक्स",
    imageUrl:
      "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340801879.webp",
    place: "Painal",
    hindiPlace: "पाइनल",
  },
  {
    name: "रेशमी देवी",
    englishName: "Resmi Devi",
    position: "समिति",
    imageUrl:
      "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340790712.webp",
    place: "Painal",
    hindiPlace: "पाइनल",
  },
];

export const historicalLeaders: { term: string; leaders: PoliticalLeader[] }[] =
  [
    {
      term: "2021 - 2025",
      leaders: [
        {
          name: "शिला देवी",
          englishName: "Shila Devi",
          position: "मुखिया",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "बाबिता कुमारी",
          englishName: "Babita Kumari",
          position: "सरपंच",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340706619.webp",
          place: "Painal",
        },
        {
          name: "दीपू कुमार",
          englishName: "Dipu Kumar",
          position: "पैक्स",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340801879.webp",
          place: "Painal",
        },
        {
          name: "रेशमी देवी",
          englishName: "Resmi Devi",
          position: "समिति",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340790712.webp",
          place: "Painal",
        },
      ],
    },
    {
      term: "2016 - 2021",
      leaders: [
        {
          name: "रुबी देवी",
          englishName: "Rubi Devi",
          position: "मुखिया",
          imageUrl: "",
          place: "Mahamadpur",
        },
        {
          name: "बाबिता कुमारी",
          englishName: "Babita Kumari",
          position: "सरपंच",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340706619.webp",
          place: "Painal",
        },
        {
          name: "दीपू कुमार",
          englishName: "Dipu Kumar",
          position: "पैक्स",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340801879.webp",
          place: "Painal",
        },
        {
          name: "रेशमी देवी",
          englishName: "Resmi Devi",
          position: "समिति",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340790712.webp",
          place: "Painal",
        },
      ],
    },
    {
      term: "2011 - 2016",
      leaders: [
        {
          name: "लिलावती देवी",
          englishName: "Lilavati Devi",
          position: "मुखिया",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340860495.webp",
          place: "Painal",
        },
        {
          name: "रमेश कुमार सिंह",
          englishName: "Ramesh Kumar Singh",
          position: "सरपंच",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340811585.webp",
          place: "Painal",
        },
        {
          name: "राकेश कुमार",
          englishName: "Rakesh Kumar",
          position: "पैक्स",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "उषा देवी",
          englishName: "Usha Devi",
          position: "समिति",
          imageUrl: "",
          place: "Painal",
        },
      ],
    },
    {
      term: "2006 - 2011",
      leaders: [
        {
          name: "श्री रामदेव सिंह",
          englishName: "Shri Ramdev Singh",
          position: "मुखिया",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340776778.webp",
          place: "Painal",
        },
        {
          name: "सतेंद्र वर्मा",
          englishName: "Satendar Verma",
          position: "सरपंच",
          imageUrl: "",
          place: "Bhagwatipur",
        },
        {
          name: "राकेश कुमार",
          englishName: "Rakesh Kumar",
          position: "पैक्स",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "उषा देवी",
          englishName: "Usha Devi",
          position: "समिति",
          imageUrl: "",
          place: "Painal",
        },
      ],
    },
    {
      term: "2001 - 2006",
      leaders: [
        {
          name: "श्री सलेश सिंह",
          englishName: "Salesh Singh",
          position: "मुखिया",
          imageUrl: "",
          place: "Ahiyapur",
        },
        {
          name: "रघुवीर सिंह",
          englishName: "Raghuveer Singh",
          position: "पैक्स",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340764755.webp",
          place: "Painal",
        },
        {
          name: "रघुवीर सिंह",
          englishName: "Raghuveer Singh",
          position: "समिति",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340764755.webp",
          place: "Painal",
        },
      ],
    },
    {
      term: "1976 - 1981",
      leaders: [
        {
          name: "श्री पारसनाथ सिंह",
          englishName: "Shri Parasnath Singh",
          position: "मुखिया",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "श्री सिद्धनाथ सिंह",
          englishName: "Shri Siddhanath Singh",
          position: "सरपंच",
          imageUrl: "",
          place: "Painal",
        },
      ],
    },
    {
      term: "1971 - 1976",
      leaders: [
        {
          name: "श्री रामदेव सिंह",
          englishName: "Shri Ramdev Singh",
          position: "मुखिया",
          imageUrl:
            "https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/leaders/1779340776778.webp",
          place: "Painal",
        },
        {
          name: "श्री पंचम राय",
          englishName: "Shri Pancham Ray",
          position: "सरपंच",
          imageUrl: "",
          place: "Subhav Tola",
        },
      ],
    },
    {
      term: "1964 - 1971",
      leaders: [
        {
          name: "श्री गणेश प्रसाद सिंह",
          englishName: "Shri Ganesh Prasad Singh",
          position: "मुखिया",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "श्री राम जन्म वर्मा",
          englishName: "Shri Ramjanm Verma",
          position: "सरपंच",
          imageUrl: "",
          place: "Srichandpur",
        },
      ],
    },
    {
      term: "1961 - 1964",
      leaders: [
        {
          name: "श्री गणेश प्रसाद सिंह",
          englishName: "Shri Ganesh Prasad Singh",
          position: "मुखिया",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "श्री राम जन्म महात्मा",
          englishName: "Shri Ram Janm Mahto",
          position: "सरपंच",
          imageUrl: "",
          place: "Mustafapur",
        },
      ],
    },
    {
      term: "1957 - 1961",
      leaders: [
        {
          name: "श्री सुदामा वर्मा",
          englishName: "Shri Sudhama Verma",
          position: "मुखिया",
          imageUrl: "",
          place: "Bhagwatipur",
        },
        {
          name: "श्री राम अनुप शर्मा",
          englishName: "Shri Ram Anup Sharma",
          position: "सरपंच",
          imageUrl: "",
          place: "Painal",
        },
      ],
    },
    {
      term: "1952 - 1957",
      leaders: [
        {
          name: "श्री कमेश्वर सिंह",
          englishName: "Shri Kameshwar Singh",
          position: "मुखिया",
          imageUrl: "",
          place: "Painal",
        },
        {
          name: "श्री गणेश प्रसाद सिंह",
          englishName: "Shri Ganesh Prasad Singh",
          position: "सरपंच",
          imageUrl: "",
          place: "Painal",
        },
      ],
    },
  ];
