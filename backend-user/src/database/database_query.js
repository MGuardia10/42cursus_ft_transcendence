class DatabaseQuery
{
	#table;
	#select;
	#where;
	#limit;
	#offset;
	#params;
	constructor(table, fields)
	{
		this.#select = fields || ["*"];
		this.#table = table;
		this.#where = [];
		this.#limit = -1;
		this.#offset = -1;
	}

	/**
	 * Adds a WHERE condition to the query with the specified operator and items.
	 *
	 * @param {Array<{key: string, value: *}>} items - An array of objects representing the conditions, 
	 * where each object contains:
	 *   - `key` (string): The column name to apply the condition to.
	 *   - `value` (*): The value to compare the column against.
	 * 
	 * @param {string} operator - The logical operator to use in the WHERE condition ('=', 'AND', 'OR', ...).
	 * If only one condition is provided, this parameter is ignored (provide undefined).
	 */
	add_where(items, operator)
	{
		this.#where.push({
			items: items,
			operator: operator
		});
	}

	add_limit(limit = -1)
	{
		this.#limit = limit;
	}

	add_offset(offset = -1)
	{
		this.#offset = offset;
	}

	generate()
	{
		/* Select */
		let params = []
		let query = "SELECT ";
		for (let i = 0; i < this.#select.length; i++)
		{
			query += this.#select[i];
			if (i < this.#select.length - 1)
				query += ", ";
		}

		/* From */
		query += ` FROM ${this.#table}`;

		/* Where */
		if (this.#where.length > 0)
		{
			query += " WHERE ";
			for (let i = 0; i < this.#where.length; i++)
			{
				/* where[i] = {items = [{key="a", value="a"}], operator = "AND"} */
				let condition = "";
				for (let j = 0; j < this.#where[i].items.length; j++)
				{
					condition += `${this.#where[i].items[j].key} = ?`;
					params.push(this.#where[i].items[j].value);
					if (j < this.#where[i].items.length - 1)
						condition += ` ${this.#where[i].operator} `;
				}

				query += `( ${condition} )`;
				if (i < this.#where.length - 1)
					query += " OR ";
			}
		}

		/* Limit */
		if (this.#limit >= 0)
		{
			query += " LIMIT ?";
			params.push(this.#limit);
		}

		/* Offset */
		if (this.#offset >= 0)
		{
			query += " OFFSET ?";
			params.push(this.#offset);
		}

		return {
			query: query,
			params: params
		};
	}

}

export default DatabaseQuery;
