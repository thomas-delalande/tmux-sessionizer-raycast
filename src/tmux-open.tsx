import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import { exec } from "child_process";
import { readdirSync } from "fs";
import { useEffect, useState } from "react";

export default function Command() {
  const [projects, setProjects] = useState<string[]>([]);
  const directory = "/Users/thomas-delalande/vgw/";
  const tmux = "/opt/homebrew/bin/tmux";
  useEffect(() => {
    const localProjects = readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    setProjects(localProjects);

    }, []);

  const selectProject = async (project: string) => {
    await run(`${tmux} new-session -A -d -s ${project} -c ${directory}/${project}`);
    await run(`${tmux} switch -t ${project}`);
  };

   const run = (command: string) : Promise<string> => {
		return new Promise((success, reject) => {
			exec(command, {}, (err, stdout) => {
				if(err) {
					reject(err);
				} else {
					success(stdout);
				}
			});
		})
	};

  return (
    <List>
      {projects.map((project, index) => (
        <List.Item
          key={index}
          title={project}
          actions={
            <ActionPanel> 
              <ActionPanel.Section>
                <Action icon={Icon.Play} title={"Select"} onAction={() => selectProject(project)} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
