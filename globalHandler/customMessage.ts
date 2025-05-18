
export default function message(message: string, statusCode: number,data?: any) {

  return {
    success:true,
    message,
    statusCode,
    data
  };
}