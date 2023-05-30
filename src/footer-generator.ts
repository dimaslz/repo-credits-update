import sampleSize from "lodash.samplesize";

const FooterGenerator = async (readme: string): Promise<string> => {
	const myData: any = await fetch("https://api.dimaslz.dev/")
		.then((data) => {
			return data.json();
		});

	return `${readme.replace(/## Author[^]+$/g, '').trim()}

## Author

\`\`\`json
{
  "name": "${myData.name} ${myData.lastname}",
  "role": "${myData.title}",
  "alias": "${myData.alias}",
${Object.entries(myData.network).map(([key, value]) => {
		return `  "${key}": "${value}",`;
	}).join("\n")}
  "tags": "${sampleSize(myData.keywords, 6).join(", ")}"
}
\`\`\`

## My other projects

${myData.projects.map((project: any) => {
		return `* [${project.url}](${project.url}): ${project.description}`
	}).join("\n")}`;
};

export default FooterGenerator;