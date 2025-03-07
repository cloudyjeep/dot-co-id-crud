import useSWR from "swr";
import { toQueryParams } from "../lib/utils";

/**
 * Delivery API config
 */
export const delivery_Api_Url = import.meta.env.VITE_DELIVERY_API_URL;
export const delivery_Api_Key = import.meta.env.VITE_DELIVERY_API_KEY;

async function fetcher(url: string, method = "GET", payload?: any) {
  const req = await fetch(url, {
    method,
    headers: {
      //   "Content-Type": "application/json",
      //   "api-key": "qGYYLapOd778366c969b8faeToHT7pHf",
      "api-key": delivery_Api_Key,
    },
    body: method != "GET" ? JSON.stringify(payload) : undefined,
    credentials: "include",
    mode: "cors",
  });

  const res = await req.json();
  return res?.rajaongkir || {};
}

interface DeliveryProvince {
  results?: {
    province_id: string;
    province: string;
  }[];
}

export const useDataProvince = () =>
  useSWR<DeliveryProvince>(
    `https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/search?keyword=a`,
    fetcher
  );

interface DeliveryCity {
  results?: {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
  }[];
}
export const useDataCity = (queries?: object) =>
  useSWR<DeliveryCity>(
    `${delivery_Api_Url}/city?${toQueryParams(queries)}`,
    fetcher
  );

interface DeliveryCost {
  results?: {
    code: string;
    name: string;
    costs?: {
      service: string;
      description: string;
      cost?: {
        value: number;
        etd: string;
        note: string;
      }[];
    }[];
  }[];
}

export const useDataCost = (queries?: object) => {
  const url = `${delivery_Api_Url}/cost`;

  return useSWR<DeliveryCost>(`${url}/${toQueryParams(queries)}`, () =>
    fetcher(url, "POST", queries)
  );
};
