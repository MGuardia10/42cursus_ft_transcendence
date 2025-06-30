import db from "../database/database.js";

function get_results( limit, page, includeTop3 )
{
	const start_position = (page - 1) * limit + (includeTop3 ? 0 : 3);
	return db.prepare(`
		SELECT
  			ROW_NUMBER() OVER (
    			ORDER BY
      				CAST(
        				(win_count * 100.0)
        				/ NULLIF(win_count + lose_count, 0)
        				AS INTEGER
      				) DESC
  			) AS position,
  			id,
  			CAST(
    			(win_count * 100.0)
    			/ NULLIF(win_count + lose_count, 0)
    			AS INTEGER
  			) AS win_percentage
		FROM players
		WHERE active=1 AND (win_count + lose_count) > 0
		ORDER BY position
		LIMIT ?
		OFFSET ?;
	`).all( limit, start_position );
}

function get_stats( limit, page, includeTop3 )
{
	const total_rows = db.prepare(`
		SELECT
  			COUNT(*) AS total_rows
		FROM players
		WHERE (win_count + lose_count) > 0;
	`).get().total_rows - (includeTop3 ? 0 : 3);

	return {
		totalPlayers: total_rows,
		page: page,
		lastPage: Math.ceil(total_rows / limit)
	}
}

export default async function ranking_all( request, reply )
{
	const { limit, page, includeTop3 } = request.query;

	try
	{
		/* Get the asked results  */
		const results = get_results( limit, page, includeTop3 );
	
		/* Get the stats */
		const stats = get_stats( limit, page, includeTop3 );

		/* Return all the data obtained */
		return reply.send({ results, stats });
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}