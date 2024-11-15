export const getHomeCategories = async (req, res) => {
    try {
        const categories = [
            {
                title: "Popular on Netflix",
                movies: await getPopularMovies()
            },
            {
                title: "New Releases",
                movies: await getNewReleases()
            }
        ]
        
        res.json(categories)
    } catch (error) {
        res.status(500).json({ message: 'Error getting categories' })
    }
} 