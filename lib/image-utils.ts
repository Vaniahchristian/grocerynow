const API_BASE =  '';

export const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) {
    return "/placeholder.svg";
  }
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  if (imagePath.startsWith('/api')) {
    return `${API_BASE}${imagePath}`;
  }
  return `${API_BASE}/api/uploads/${imagePath}`;
};


