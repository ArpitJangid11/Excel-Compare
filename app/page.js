import Mysheet from "./mysheet";
// import "@/styles/globals.css";
import ExcelComparator from "./compareExcel";
const page = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            Excel Sheet Manager
          </h1>
          <p className='text-gray-600 text-lg'>
            Create, compare, and manage your Excel sheets with ease
          </p>
        </div>

        <div className='max-w-6xl mx-auto space-y-8'>
          <Mysheet />
          <ExcelComparator />
        </div>
      </div>
    </div>
  );
};

export default page;
