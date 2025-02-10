import api from "@config/axiosConfig.js";

export const fetchProfileData = async (email = "") => {
  try {
    const response = await api.get("digital_profiles/current_user_profile/", {
      params: { email },
    });
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
};


export const vCardProfile = async (encodedEmail) => {
  try {
    const response = await api.get(`digital_profiles/profile/${encodedEmail}/`);
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
};

