// // src/lib/apiService.ts
// let baseUrl = "https://onlinewriting.onrender.com"; // default

// export const setBaseUrl = (url: string) => {
//   baseUrl = url;
// };

// export const apiFetch = async (
//   path: string,
//   options: RequestInit = {}
// ): Promise<any> => {
//   const response = await fetch(`${baseUrl}${path}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "API error");
//   }

//   return data;
// };
