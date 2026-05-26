export const PROGRAMS = [
  {
    id: 'pregrado',
    label: 'Pregrado',
    color: '#F2DE3C',
    colorBg: 'rgba(242,222,60,0.14)',
    colorText: '#7A6A00',
    colorActive: '#02172B',
    colorActiveText: '#F2DE3C',
    accentShadow: 'rgba(2,23,43,0.18)'
  },
  {
    id: 'regencia',
    label: 'Regencia en Farmacias',
    color: '#00B4DD',
    colorBg: 'rgba(0,180,221,0.13)',
    colorText: '#005A8E',
    colorActive: '#00407B',
    colorActiveText: '#ffffff',
    accentShadow: 'rgba(0,64,123,0.22)'
  },
  {
    id: 'ilex',
    label: 'ILEX',
    color: '#68CC87',
    colorBg: 'rgba(104,204,135,0.15)',
    colorText: '#2D7A4A',
    colorActive: '#1E5C36',
    colorActiveText: '#68CC87',
    accentShadow: 'rgba(30,92,54,0.22)'
  },
  {
    id: 'extension',
    label: 'Extensión',
    color: '#F26161',
    colorBg: 'rgba(242,97,97,0.13)',
    colorText: '#8B2020',
    colorActive: '#7A1C1C',
    colorActiveText: '#FFADAD',
    accentShadow: 'rgba(122,28,28,0.22)'
  }
]

export function getProgram(id) {
  return PROGRAMS.find(p => p.id === id) || PROGRAMS[0]
}
