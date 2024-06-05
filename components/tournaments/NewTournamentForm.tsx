'use client';

import { TeamData } from '@/models/TeamsData';
import { GetAllTeams } from '@/server/TeamFunctions';
import { create } from 'domain';
import { useEffect, useState } from 'react';
import TeamSelectFormInput from './TeamFormInput';
import { ProfanityCheck } from '@/utils/ProfanityCheck';

type TournamentFormProps = {};

enum TournamentType {
    SINGLE_ELIMINATION = 'Single Elimination',
    DOUBLE_ELIMINATION = 'Double Elimination',
}

export default function NewTournamentForm() {
    const [teams, setTeams] = useState<TeamData[]>([]);
    const [teamSelectionInputs, setTeamSelectionInputs] = useState<
        HTMLInputElement[]
    >([]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        var tournamentName = e?.target?.tournamentName.value as string;
        if (await ProfanityCheck(tournamentName)) {
            var message = `Profanity detected in the Tournament Name: ${tournamentName}. Please clean it up.`;
            console.error(message);
            alert(message);
            return;
        }
    };

    const handleAddTeam = () => {
        const newTeamInput = document.createElement('input');
        newTeamInput.type = 'text';
        newTeamInput.className = 'border border-gray-300 p-2';
        setTeamSelectionInputs(teamSelectionInputs.concat(newTeamInput));
    };

    const createTeamInputs = (teamSelectionInputs: HTMLInputElement[]) => {
        return teamSelectionInputs.map((item, index) => {
            return (
                <TeamSelectFormInput key={index} index={index} teams={teams} />
            );
        });
    };

    useEffect(() => {
        GetAllTeams().then((teams) => {
            setTeams(teams);
        });
    }, []);

    return (
        <div className="flex-1 flex flex-col gap-6 items-center">
            <h1 className="text-2xl">Create a New Tournament</h1>
            <form
                className="flex-1 flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                <label className="text-lg">Tournament Name</label>
                <input
                    type="text"
                    name="tournamentName"
                    className="border border-gray-300 p-2 text-black"
                />
                <label className="text-lg">Description</label>
                <input
                    type="text"
                    name="description"
                    className="border border-gray-300 p-2 text-black"
                />
                <label className="text-lg">Tournament Type</label>
                <select
                    className="border border-gray-300 p-2 text-black"
                    name="tournamentType"
                >
                    <option value={TournamentType.SINGLE_ELIMINATION}>
                        {TournamentType.SINGLE_ELIMINATION}
                    </option>
                    <option value={TournamentType.DOUBLE_ELIMINATION}>
                        {TournamentType.DOUBLE_ELIMINATION}
                    </option>
                </select>
                <label className="text-lg">Teams</label>
                {createTeamInputs(teamSelectionInputs)}
                <button
                    className="bg-blue-500 text-white p-2"
                    onClick={handleAddTeam}
                >
                    Add Team
                </button>

                <button className="bg-green-500 text-white p-2" type="submit">
                    Create
                </button>
            </form>
        </div>
    );
}
