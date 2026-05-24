// Constants for API URLs
import { Platform } from "react-native";

// DEV API 
const LOCALHOST = Platform.OS === "android" ? "10.0.2.2" : "192.168.1.41";
export const API_BASE_URL = `http://${LOCALHOST}:8080/api/v1`;

// PROD API 
// const PRODURL = 'https://painal-village-938317456401.asia-south1.run.app/api/v1'
// export const API_BASE_URL = PRODURL;

export const API_ENDPOINTS = {
  primaryFamilies: `${API_BASE_URL}/primary-families`,
  primaryFamilyById: (id: number) => `${API_BASE_URL}/primary-families/${id}`,
  primaryFamilyChildren: (id: number) =>
    `${API_BASE_URL}/primary-families/${id}/children`,
  primaryFamilySiblings: (id: number) =>
    `${API_BASE_URL}/primary-families/${id}/siblings`,
  primaryFamilyAvatar: (id: number, version?: string) =>
    version ? `${API_BASE_URL}/members/${id}.webp?v=${version}` : `${API_BASE_URL}/primary-families/members/${id}/avatar`,
  primaryFamilyDetails: (id: number) =>
    `${API_BASE_URL}/primary-families/members/${id}/details`,
  addPrimaryFamilyChild: (id: number) =>
    `${API_BASE_URL}/primary-families/members/${id}/children`,
  deletePrimaryFamilyMember: (id: number) =>
    `${API_BASE_URL}/primary-families/members/${id}`,
  authLogin: `${API_BASE_URL}/auth/login`,
  dataVersion: `${API_BASE_URL}/data-version`,
  membersJson: `${API_BASE_URL}/data/members.json`,
  reportMemberDetails: `${API_BASE_URL}/members/reports`,
  requestAddChild: `${API_BASE_URL}/members/requests/child`,
};
