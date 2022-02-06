import json
import os
 
# Open a file
path = r"C:\\Users\\luket\\OneDrive\\Documents\\Python Scripts\\Dataforged\\datasworn\\"
oracle_jsons = []
skip = ["ironsworn_move_oracles.json", "ironsworn_oracles_delve_sites.json", "ironsworn_oracles_settlement.json", "ironsworn_oracles_prompts.json"]

with os.scandir(path) as dirs:
    for entry in dirs:
        if "oracles" in entry.name and ".json" in entry.name:
            if entry.name not in skip:
                oracle_jsons.append(entry.name.replace(".json",""))


def open_json():
    for oracle in oracle_jsons:
        with open(f"{oracle}.json", "r", encoding="utf-8") as file:
            data = json.load(file)
        json_to_md(data, oracle)

def json_to_md(data, name):
    print(f"Creating {name}.md")
    title = data["Title"]
    oracles = data["Oracles"]

    with open(f"{name}.md", "w") as md:
        md.write("# " + title + "\n")
        md.write("## Go to a Specific Oracle Table:\n".title())
        
        for oracle in oracles: # Creates the Table of Contents
            name = oracle["Name"]
            name_ref = name.lower().replace(" ","-")
            md.write(f"- [{name}](#{name_ref})\n")
            
        for oracle in oracles: # Creates actual content
            md.write("---\n")
            md_table = "| Roll (d100) | Description |\n| :--- | :--- |\n"
            name = oracle["Name"]
            table = oracle["Oracle Table"]
            prev_chance = 0
            for item in table:
                chance = item["Chance"]
                roll = (str(prev_chance + 1) + " - " + str(chance)) if int(chance) - prev_chance > 1 else chance
                description = item["Description"]
                md_table += f"| {roll} | {description} |\n"
                prev_chance = int(chance)
            md.write(f'## {name}\n')
            md.write(md_table)
    print(f"{name}.md succeffully created.")
        
open_json()