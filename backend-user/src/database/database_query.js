class DatabaseQuery
{
	#table;
	#select;
	#where;
	#order_by;
	#limit;
	#offset;
	/**
	 * Constructs a new instance of a database query object.
	 *
	 * @param {string} table - The name of the database table to query.
	 * @param {string[]} [fields=["*"]] - The fields to select in the query. Defaults to all fields ("*").
	 */
	constructor(table, fields)
	{
		this.#select = fields || ["*"];
		this.#table = table;
		this.#where = [];
		this.#order_by = [];
		this.#limit = -1;
		this.#offset = -1;
	}

	/**
	 * Adds a WHERE condition to the query with the specified operator and items.
	 *
	 * @param {Array<{key: string, value: *}>} items - An array of objects representing the conditions, 
	 * where each object contains:
	 *   - `key` (string): The column name to apply the condition to.
	 *   - `action` (string): The action to perform on the key-value ('=', '>', 'LIKE', ...).
	 *   - `value` (*): The value to compare the column against.
	 * 
	 * @param {string} operator - The logical operator to use in the WHERE condition ('=', 'AND', 'OR', ...).
	 * If only one condition is provided, this parameter is ignored (provide undefined).
	 * @param {string} [previous_operator] - The logical operator to use before the WHERE condition
	 * ('=', 'AND', 'OR', ...) if there is another condition.
	 */
	add_where(items, operator, previous_operator)
	{
		this.#where.push({
			items: items,
			operator: operator,
			previous_operator: previous_operator
		});
	}

	/**
	 * Adds an ORDER BY clause to the query.
	 *
	 * @param {string} column - The column name to sort by.
	 * @param {string} mode - The sorting mode, either "ASC" (ascending) or "DESC" (descending). Optional.
	 */
	add_order_by(column, mode)
	{
		this.#order_by.push({
			column: column,
			mode: mode
		});
	}

	/**
	 * Sets the LIMIT clause for the query.
	 *
	 * @param {number} limit - The maximum number of rows to return. Defaults to -1 (no limit).
	 */
	add_limit(limit = -1)
	{
		this.#limit = limit;
	}

	/**
	 * Sets the OFFSET clause for the query.
	 *
	 * @param {number} offset - The number of rows to skip before starting to return rows. Defaults to -1 (no offset).
	 */
	add_offset(offset = -1)
	{
		this.#offset = offset;
	}

	/**
	 * Generates an SQL query string based on the current state of the object.
	 * The query includes SELECT, FROM, WHERE, LIMIT, and OFFSET clauses, 
	 * and supports parameterized queries to prevent SQL injection.
	 *
	 * @returns {Object} An object containing:
	 *   - `query` {string}: The generated SQL query string.
	 *   - `params` {Array}: An array of parameters to be used in the query.
	 *
	 * @example
	 * // Example usage:
	 * const result = generate();
	 * console.log(result.query); // "SELECT column1, column2 FROM table WHERE (key1 = ?) OR (key2 = ?) LIMIT ? OFFSET ?"
	 * console.log(result.params); // ["value1", "value2", 10, 5]
	 *
	 * @description
	 * - The `SELECT` and `FROM` clause are set on constructor
	 * - The `WHERE` clause is constructed from the `add_where` method.
	 * - The `LIMIT` and `OFFSET` clauses are added on `add_limit` and `add_offset` methods.
	 */
	generate()
	{
		/* Select */
		let params = [];
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
					condition += `${this.#where[i].items[j].key} ${this.#where[i].items[j].action} ?`;
					params.push(this.#where[i].items[j].value);
					if (j < this.#where[i].items.length - 1)
						condition += ` ${this.#where[i].operator} `;
				}

				query += `( ${condition} )`;
				if (i < this.#where.length - 1)
				{
					let previous_operator = this.#where[i + 1].previous_operator || "OR";
					query += ` ${previous_operator} `;
				}
			}
		}

		/* Order by */
		if (this.#order_by.length > 0)
		{
			query += " ORDER BY ";
			for (let i = 0; i < this.#order_by.length; i++)
			{
				query += `${this.#order_by[i].column}`;
				if (this.#order_by[i].mode)
					query += ` ${this.#order_by[i].mode}`;
				if (i < this.#order_by.length - 1)
					query += ", ";
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
