import { useState, useEffect } from "react";
import axios from "axios";
import "./insights.css";
import BaseLayout from "../Layouts/BaseLayout";

const Insights = () => {
	const [news, setNews] = useState([]);
	const [loading, setLoading] = useState(true);

	const blogs = [
		{
			id: 1,
			title: "The Impact of Single-Use Coffee Cups on Our Environment",
			content:
				"Every year, billions of disposable coffee cups end up in landfills. These cups, lined with plastic, take over 30 years to decompose...",
			author: "Environmental Watch",
			date: "2023-10-15",
		},
		{
			id: 2,
			title: "Zero Waste Living: Starting Your Journey",
			content:
				"Transitioning to a zero-waste lifestyle doesn't happen overnight. Start with simple switches like reusable coffee cups...",
			author: "Green Living",
			date: "2023-10-12",
		},
		{
			id: 3,
			title: "The Rise of Sustainable Coffee Shops",
			content:
				"More coffee shops are adopting eco-friendly practices, from compostable cups to reward programs for bringing reusable containers...",
			author: "Sustainable Business Weekly",
			date: "2023-10-08",
		},
		{
			id: 4,
			title: "Understanding Your Carbon Footprint",
			content:
				"Daily choices, including your coffee consumption habits, contribute to your overall carbon footprint...",
			author: "Climate Action Now",
			date: "2023-10-05",
		},
		{
			id: 5,
			title: "Innovations in Eco-Friendly Packaging",
			content:
				"New developments in biodegradable materials are revolutionizing how we think about disposable containers...",
			author: "Tech & Environment",
			date: "2023-10-01",
		},
	];

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await axios.get(`https://newsapi.org/v2/everything`, {
					params: {
						q: "environmental conservation sustainability",
						apiKey: "95f8bd3b06cc4d1391a6e75395367834",
						language: "en",
						pageSize: 5,
					},
				});
				setNews(response.data.articles);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching news:", error);
				setLoading(false);
			}
		};

		fetchNews();
	}, []);

	return (
		<BaseLayout>
			<div className='insights-container'>
				<section className='blogs-section'>
					<h2>Environmental Blogs</h2>
					<div className='blogs-grid'>
						{blogs.map((blog) => (
							<div key={blog.id} className='blog-card'>
								<h3>{blog.title}</h3>
								<p>{blog.content}</p>
								<div className='blog-meta'>
									<span>{blog.author}</span>
									<span>{blog.date}</span>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className='news-section'>
					<h2>Environmental News</h2>
					{loading ? (
						<p>Loading news...</p>
					) : (
						<div className='news-grid'>
							{news.map((article, index) => (
								<div key={index} className='news-card'>
									<h3>{article.title}</h3>
									<p>{article.description}</p>
									<div className='news-meta'>
										<span>{article.source.name}</span>
										<span>{article.publishedAt}</span>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</BaseLayout>
	);
};

export default Insights;
