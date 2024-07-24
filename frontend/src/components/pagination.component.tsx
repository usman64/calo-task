interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (_: number) => void;
}

const Pagination = ({ total, currentPage, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button onClick={handlePrevious} disabled={currentPage === 1} className="px-4 py-2 mx-1 bg-gray-300 rounded">
        Previous
      </button>
      <span className="px-4 py-2 mx-1">
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 mx-1 bg-gray-300 rounded">
        Next
      </button>
    </div>
  );
};

export default Pagination;
