import React from 'react';

const ModulePage = ({ title, icon: Icon }) => (
    <div className="p-8 bg-slate-800 rounded-xl shadow-xl m-4 animate-fadeIn">
        <div className="flex items-center text-sky-400 mb-6">
            <Icon size={40} className="mr-4" />
            <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        <p className="text-slate-300 text-lg">
            Contenido del {title.toLowerCase()}. Aquí puedes desarrollar la funcionalidad específica de este módulo.
        </p>
        <div className="mt-8 p-6 bg-slate-700 rounded-lg">
            <h3 className="text-xl font-semibold text-sky-300 mb-3">Próximos pasos:</h3>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
                <li>Define la estructura de datos para este módulo en tu backend FastAPI.</li>
                <li>Implementa los endpoints necesarios en FastAPI.</li>
                <li>Crea funciones en el frontend para consumir estos endpoints.</li>
                <li>Diseña la interfaz de usuario específica para las funcionalidades.</li>
            </ul>
        </div>
    </div>
);

export default ModulePage;