import React, { Component } from "react";
import axios from "axios";

const axiosGithubGraphQL = axios.create({
	baseURL: "https://api.github.com/graphql",
	headers: {
		Authorization: "bearer eed936b4304c8b58b5ee955d34155e819487236e"
	}
});

// const GET_ORGANIZATION = `
// {
//   organization( login: "the-road-to-learn-react") {
//     name
//     url
//   }
// }`;

const getIssuesOfRepositoryQuery = (organization, repository) => `
  {
    organization(login: "${organization}") {
      name
      url
      repository(name: "${repository}") {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url   
            }
          }
        }
      }
    }
  }
`;

class App extends Component {
	state = {
		path: "the-road-to-learn-react/the-road-to-learn-react",
		organization: null,
		errors: null
	};

	componentDidMount() {
		// fetch data
		this.onFetchFromGitHub(this.state.path);
	}

	onChange = (event) => {
		this.setState({ path: event.target.value });
	};

	onSubmit = (event) => {
		// fetch data
		this.onFetchFromGitHub(this.state.path);
	};

	onFetchFromGitHub = (path) => {
		const [organization, repository] = path.split("/");

		axiosGithubGraphQL
			.post("", { query: getIssuesOfRepositoryQuery(organization, repository) })
			.then((result) =>
				this.setState({
					organization: result.data.data.organization,
					errors: result.data.errors
				})
			);
	};

	render() {
		const { path, organization, errors } = this.state;

		return (
			<div>
				<h1>{TITLE}</h1>

				<form onSubmit={this.onSubmit}>
					<label htmlFor="url">Show open issues for https://github.com/</label>
					<input
						id="url"
						type="text"
						value={path}
						onChange={this.onChange}
						style={{ width: "300px" }}
					/>
					<button type="submit">Search</button>
				</form>

				<hr />

				{organization ? (
					<Organization organization={organization} errors={errors} />
				) : (
					<p>No information yet ...</p>
				)}
			</div>
		);
	}
}

const Organization = ({ organization, errors }) => {
	if (errors) {
		return (
			<p>
				<strong>Something went wrong:</strong>
				{errors.map((error) => error.message).join(" ")}
			</p>
		);
	}

	return (
		<div>
			<p>
				<strong>Issues from Organization:</strong>
				<a href={organization.url}>{organization.name}</a>
			</p>
			<Repository repository={organization.repository} />
		</div>
	);
};

const Repository = ({ repository }) => (
	<div>
		<p>
			<strong>In Repository:</strong>
			<a href={repository.url}>{repository.name}</a>
		</p>
		<ul>
			{repository.issues.edges.map((issue) => (
				<li key={issue.node.id}>
					<a href={issue.node.url}>{issue.node.title}</a>
				</li>
			))}
		</ul>
	</div>
);

export default App;
