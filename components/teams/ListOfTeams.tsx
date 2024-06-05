'use client';

import { TeamData } from '@/models/TeamsData';
import { TournamentData } from '@/models/TournamentData';
import { UserData } from '@/models/UserData';
import { GetAllTeams } from '@/server/TeamFunctions';
import { GetAllTournaments } from '@/server/TournamentFunctions';
import { GetAllUsersData } from '@/server/UserDataFunctions';
import { useEffect, useState } from 'react';

type ListOfTeams = {
    page: number;
};

export default function ListOfTeams(props: ListOfTeams) {
    const [teams, setTeams] = useState<TeamData[]>([]);
    const [players, setPlayers] = useState<UserData[]>();
    const [update, setUpdate] = useState(true);
    const [page, setPage] = useState<number>(0);
    const [pages, setPages] = useState<Array<number>>([]);

    useEffect(() => {
        GetAllTeams().then((data: TeamData[]) => {
            setTeams(data as TeamData[]);
        });
        GetAllUsersData().then((data) => {
            setPlayers(data);
        });
        if (page == undefined) {
            setPage(props.page);
        }
    }, [update]);

    useEffect(() => {
        setUpdate(true);
    }, [page]);

    useEffect(() => {
        GetAllTeams().then((data) => {
            if (data) {
                const totalPage = Math.ceil(data.length / 10);
                const pages = [];
                for (let i = 0; i < totalPage; i++) {
                    pages.push(i);
                }
                setPages(pages);
            }
        });
    }, []);

    return (
        <div className="flex flex-col w-full h-full text-gray-700 bg-gray-200 shadow-md rounded-xl bg-clip-border min-w-xs max-w-md sm:max-w-lg md:max-w-1xl lg:max-w-2xl xl:max-w-4xl">
            <div className="p-6 px-0 overflow-scroll">
                <table className="w-full text-left table-auto min-w-max">
                    <thead>
                        <tr>
                            <th className="bg-gray-400 border text-left px-8 py-4 text-black">
                                Team ID
                            </th>
                            <th className="bg-gray-400 border text-left px-8 py-4 text-black">
                                Team Name
                            </th>
                            <th className="bg-gray-400 border text-left px-8 py-4 text-black">
                                Forward
                            </th>
                            <th className="bg-gray-400 border text-left px-8 py-4 text-black">
                                Defense
                            </th>
                            <th className="bg-gray-400 border text-left px-8 py-4 text-black">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team: TeamData) => (
                            <tr
                                key={team.id}
                                className="bg-slate-200 hover:bg-slate-500 focus:bg-gray-300 active:bg-red-200 text-black hover:text-black focus:text-black active:text-black"
                            >
                                <td className="border px-8 py-4">
                                    <a href={`/team/${team.id}`}>{team.id}</a>
                                </td>
                                <td className="border px-8 py-4">
                                    {team.team_name}
                                </td>
                                <td className="border px-8 py-4">
                                    {
                                        players?.find(
                                            (player) =>
                                                player.id === team.forward_id
                                        )?.full_name
                                    }
                                </td>
                                <td className="border px-8 py-4">
                                    {
                                        players?.find(
                                            (player) =>
                                                player.id === team.defense_id
                                        )?.full_name
                                    }
                                </td>
                                <td className="border px-8 py-4">
                                    {team.created_at}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
                <button
                    className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => {
                        if (page > 0) {
                            setPage(page - 1);
                        }
                    }}
                >
                    Previous
                </button>
                <div className="flex items-center gap-2">
                    {pages.map((page, index) => (
                        <button
                            className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            key={index}
                        >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                {index}
                            </span>
                        </button>
                    ))}
                </div>
                <button
                    className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => {
                        if (page < pages.length - 1) {
                            setPage(page + 1);
                        }
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
