
export interface AgriProduct {
  Start_time: string;
  End_time: string;
  CropCode: string;
  CropName: string;
  MarketName: string;
  TransDate: string;
  MarketCode: string;
  Upper_Price: number;
  Middle_Price: number;
  Lower_Price: number;
  Avg_Price: number;
  Trans_Quantity: number;
  Page?: string;
  TcType: string;
}

export interface Market {
  MarketCode: string;
  MarketName: string;
  Type: string;
}

export interface PlantEpidemic {
  City: string;
  PlantName: string;
  Body: string;
  Prescription: string;
  Issue: string;
  Subject: string;
  PubDate: string;
}

export interface PestDiseaseDiagnosis {
  Type: string;
  ProductName: string;
  Question: string;
  Answer: string;
  Provision: string;
}