export default function message(message: string, statusCode: number) {
  return {
    success:true,
    message,
    statusCode,
  };
}