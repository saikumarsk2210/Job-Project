const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const scrapeIndeed = async (jobTitle, location) => {
  const baseUrl = 'https://www.indeed.com/jobs';
  const queryParams = `q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`;
  const url = `${baseUrl}?${queryParams}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const $ = cheerio.load(data);
        const jobs = [];

        $('.job_seen_beacon').each((index, element) => {
          const jobTitle = $(element).find('h2 a').text().trim();
          const company = $(element).find('.companyName').text().trim();
          const location = $(element).find('.companyLocation').text().trim();
          const description = $(element).find('.job-snippet').text().trim();
          const jobUrl = 'https://www.indeed.com' + $(element).find('h2 a').attr('href');

          jobs.push({
            title: jobTitle,
            company: company,
            location: location,
            description: description,
            url: jobUrl,
          });
        });

        resolve(jobs);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

app.get('/scrape', async (req, res) => {
  const { jobTitle, location } = req.query;

  try {
    const jobs = await scrapeIndeed(jobTitle, location);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape jobs' });
  }
});

app.post('/search-history', async (req, res) => {
    const { userId, searchQuery, location } = req.body;

    try {
        const { data, error } = await supabase
            .from('search_history')
            .insert([
                { user_id: userId, search_query: searchQuery, location: location, timestamp: new Date() }
            ]);

        if (error) {
            console.error("Error inserting search history:", error);
            return res.status(500).json({ error: "Failed to save search history" });
        }

        res.status(200).json({ message: "Search history saved successfully", data });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
