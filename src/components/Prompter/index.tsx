/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  place,
  actions,
  bodyParts,
  scenario,
} from "../../data/smutPrompts.json";

interface SmutData {
  [key: string]: string[];
}

interface SelectedNumbers {
  [key: string]: number;
}

const Prompter: React.FC = () => {
  const [jsonData, setJsonData] = useState<SmutData>({});
  const [randomResults, setRandomResults] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedNumbers, setSelectedNumbers] = useState<SelectedNumbers>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setJsonData({ place, actions, bodyParts, scenario });
      } catch (error) {
        console.error("Error setting initial state:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (arrayName: string) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [arrayName]: !prevSelectedItems[arrayName],
    }));
  };

  const handleNumberChange = (arrayName: string, value: number) => {
    setSelectedNumbers((prevSelectedNumbers) => ({
      ...prevSelectedNumbers,
      [arrayName]: value,
    }));
  };

  const handleGenerateRandom = () => {
    const newRandomResults: { [key: string]: string } = {};

    const usedIndices: { [key: string]: number[] } = {};

    Object.keys(selectedItems).forEach((arrayName) => {
      if (selectedItems[arrayName]) {
        const dataArray = (jsonData as any)[arrayName];
        const selectedNumber = selectedNumbers[arrayName] || 1;

        if (dataArray && dataArray.length > 0) {
          const resultsArray: string[] = [];

          Array.from({ length: selectedNumber }, () => {
            let randomIndex: number;
            do {
              randomIndex = Math.floor(Math.random() * dataArray.length);
            } while (usedIndices[arrayName]?.includes(randomIndex));

            usedIndices[arrayName] = usedIndices[arrayName] || [];
            usedIndices[arrayName].push(randomIndex);

            const randomValue = dataArray[randomIndex];
            resultsArray.push(randomValue);
          });

          newRandomResults[arrayName] = resultsArray.join(", ");
        }
      }
    });

    setRandomResults(newRandomResults);
  };

  const constructSentence = () => {
    const placeValue = randomResults["place"] || "";
    const scenarioValue = randomResults["scenario"] || "";
    const bodyPartValue = randomResults["bodyParts"] || "";
    const actionValue = randomResults["actions"] || "";

    return `Crowley and Aziraphale ${placeValue && "during " + placeValue} ${
      scenarioValue && ", in " + scenarioValue
    } ${bodyPartValue && ", using their " + bodyPartValue} ${
      actionValue && ", doing " + actionValue
    }.`;
  };

  return (
    <div>
      <h1>Random Smut prompt Generator</h1>
      <p>
        You have to create something with the words you get. Happy smutting!
      </p>
      <div>
        {Object.keys(jsonData).map((arrayName) => (
          <div key={arrayName} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedItems[arrayName] || false}
                onChange={() => handleCheckboxChange(arrayName)}
              />
              {arrayName}
            </label>
            {selectedItems[arrayName] && (
              <div style={{ display: "inline-block", marginLeft: "10px" }}>
                {arrayName.toLowerCase() !== "place" &&
                  arrayName.toLowerCase() !== "scenario" && (
                    <React.Fragment>
                      <p
                        style={{ display: "inline-block", marginRight: "5px" }}
                      >
                        Choose how many:
                      </p>
                      <select
                        value={selectedNumbers[arrayName] || 1}
                        onChange={(e) =>
                          handleNumberChange(
                            arrayName,
                            parseInt(e.target.value, 10)
                          )
                        }
                      >
                        {[1, 2, 3, 4].map((number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        ))}
                      </select>
                    </React.Fragment>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleGenerateRandom}>Generate Random</button>
      <div>
        <h2>Random Results:</h2>
        <ul>
          {Object.keys(randomResults).map((key) => (
            <li key={key}>
              {key}: {randomResults[key]}
            </li>
          ))}
        </ul>
        {Object.keys(randomResults).length > 0 && <p>{constructSentence()}</p>}
      </div>
    </div>
  );
};

export default Prompter;
