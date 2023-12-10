const Pagination = ({ currentPage, totalPages, paginate }) => {
	if (totalPages === 0) return null; // Hide if there are no posts at all

	const pageNumbers = [1];

	if (totalPages > 1) {
		for (let i = 2; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	}

	return (
		<nav>
			<ul className="pagination justify-content-center">
				{pageNumbers.map((number) => (
					<li
						key={number}
						className={`page-item ${
							number === currentPage ? "active" : ""
						}`}
					>
						<a
							onClick={() => paginate(number)}
							href="#!"
							className="page-link"
						>
							{number}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Pagination;
