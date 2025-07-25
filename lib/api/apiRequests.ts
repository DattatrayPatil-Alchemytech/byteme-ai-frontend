import axios from "@/lib/api/axios";

export function getRequestWithParams(url: string, queryParams: unknown) {
  return axios.get(url, { params: queryParams });
}

export function getRequest(url: string) {
  return axios.get(url);
}

export function postRequest(url: string, payload = null, headers = {}) {
  return axios.post(url, payload, { headers });
}

export function patchRequest(url: string, payload: unknown, headers = {}) {
  return axios.patch(url, payload, { headers });
}

export function deleteRequest(url: string) {
  return axios.delete(url);
}

export function deleteRequestWithParams(url: string, payload: unknown) {
  return axios.delete(url, { data: payload });
} 