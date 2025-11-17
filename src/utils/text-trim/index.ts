const trimText = (text: string, limit: number = 80) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};
export default trimText;