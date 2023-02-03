import { Action, ActionPanel, closeMainWindow, getPreferenceValues, Icon, List } from "@raycast/api";
import { exec } from "child_process";
import { readdirSync } from "fs";
import { useEffect, useState } from "react";

type Preferences = {
  tmux: string;
  terminal: {
    path: string;
  };
  projectsDir1: string;
  projectsDir2: string;
};

export default function Command() {
  const [projects, setProjects] = useState<string[]>([]);
  const preferences = getPreferenceValues<Preferences>();
  const tmuxPath = preferences.tmux;
  const terminalPath = preferences.terminal.path;

  useEffect(() => {
    const projectDirs = [preferences.projectsDir1, preferences.projectsDir2];
    console.log(preferences);
    const localProjects = projectDirs.flatMap((directory) => {
      if (directory === undefined) return [];
      return readdirSync(directory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => `${directory}/${dirent.name}`);
    });
    setProjects(localProjects);
  }, []);

  const selectProject = async (project: string) => {
    const name = project.split("/").pop();
    try {
      await run(`${tmuxPath} new-session -A -d -s ${name} -c ${project}`);
      await run(`${tmuxPath} switch -t ${name}`);
    } catch (err) {
      await run(`${tmuxPath} switch -t ${name}`);
    } finally {
      await run(`open ${terminalPath}`);
      closeMainWindow({
        clearRootSearch: true,
      });
    }
  };

  const run = (command: string): Promise<string> => {
    return new Promise((success, reject) => {
      exec(command, {}, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          success(stdout);
        }
      });
    });
  };

  return (
    <List>
      {projects.map((project, index) => (
        <List.Item
          key={index}
          title={project.split("/").pop() || project}
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
