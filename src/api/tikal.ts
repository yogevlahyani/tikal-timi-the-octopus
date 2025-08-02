// API Types
export interface Bean {
  BeanId: number;
  FlavorName: string;
  Description: string;
  Ingredients: string[];
  ColorGroup: string;
  ImageUrl: string;
  GlutenFree: boolean;
  SugarFree: boolean;
  Seasonal: boolean;
  Kosher: boolean;
}

export interface Color {
  colorId: string;
  colorDescription: string;
  hex: string[];
}

export interface Combination {
  CombinationId: number;
  Name: string;
  TagSerialized: string[];
}

export interface ApiResponse<T> {
  total: number;
  data: T[];
}

export interface BeansParams {
  limit?: number;
  offset?: number;
}

export interface ColorsParams {
  colorId?: string;
}

export interface HealthResponse {
  status: string;
}

// API Client
export class TikalApiClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl = 'https://tikal-home-assignment.vercel.app') {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getBeans(params?: BeansParams): Promise<ApiResponse<Bean>> {
    const searchParams = new URLSearchParams();

    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.offset) {
      searchParams.append('offset', params.offset.toString());
    }

    const query = searchParams.toString();
    const endpoint = `/api/beans${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<Bean>>(endpoint);
  }

  async fetchAllParallel() {
    const PAGE_SIZE = 50;
    const first = await this.getBeans({ limit: PAGE_SIZE, offset: 0 });
    const total = Number(first.total);
    const pages = Math.ceil(total / PAGE_SIZE);

    const offsets = Array.from({ length: pages }, (_, i) => i * PAGE_SIZE);
    const pagePromises = offsets.map((offset) =>
      this.getBeans({ limit: PAGE_SIZE, offset })
    );

    const results = await Promise.all(pagePromises);
    // Keep the original order
    return results.flatMap((p) => p.data);
  }

  async getColors(params?: ColorsParams): Promise<ApiResponse<Color>> {
    const searchParams = new URLSearchParams();

    if (params?.colorId) {
      searchParams.append('colorId', params.colorId);
    }

    const query = searchParams.toString();
    const endpoint = `/api/colors${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<Color>>(endpoint);
  }

  async getCombinations(): Promise<ApiResponse<Combination>> {
    return this.request<ApiResponse<Combination>>('/api/combinations');
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health');
  }
}
// Default instance
const API_URL = import.meta.env.VITE_API_URL;
export const tikalApi = new TikalApiClient(API_URL);