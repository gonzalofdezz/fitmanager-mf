import { useState, useEffect, useMemo } from 'react';
import { reservaService, Reserva } from '../../services/reservaService';
import { useAuth } from '../../context/AuthContext';
import './ReservaCalendario.css';

const TOTAL_AULAS = 10;
const MAX_DIAS_VISTA = 30;
const MAX_DIAS_SEMANA = 3;

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

type TipoUso = 'PERSONAL' | 'GRUPAL';

interface ModalState {
  fecha: Date | null;
  open: boolean;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekKey(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 1 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function toLocalISOString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}T10:00:00`;
}

export function ReservaCalendario() {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ fecha: null, open: false });
  const [tipoUso, setTipoUso] = useState<TipoUso>('PERSONAL');
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number>(1);
  const [confirmandoReserva, setConfirmandoReserva] = useState(false);
  const [vistaOffset, setVistaOffset] = useState(0);

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fechaLimite = useMemo(() => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + MAX_DIAS_VISTA);
    return d;
  }, [hoy]);

  const fetchReservas = useMemo(
    () => async () => {
      if (!usuario?.id) return;
      setLoading(true);
      try {
        const data = await reservaService.listByUsuarioId(usuario.id);
        setReservas(data.filter((r) => r.estado !== 'CANCELADA'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [usuario?.id],
  );

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const calendarDays = useMemo(() => {
    const startDay = new Date(hoy);
    const dayOfWeek = startDay.getDay() === 0 ? 6 : startDay.getDay() - 1;
    startDay.setDate(startDay.getDate() - dayOfWeek + vistaOffset * 7);
    const days: Date[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(startDay);
      d.setDate(startDay.getDate() + i);
      days.push(d);
    }
    return days;
  }, [hoy, vistaOffset]);

  const reservasPorFecha = useMemo(() => {
    const map: Record<string, Reserva[]> = {};
    reservas.forEach((r) => {
      const fecha = new Date(r.fechaReserva);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [reservas]);

  const reservasEnDia = (fecha: Date): Reserva[] => {
    const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
    return reservasPorFecha[key] || [];
  };

  const reservasPorSemana = useMemo(() => {
    const map: Record<string, number> = {};
    reservas.forEach((r) => {
      const wk = getWeekKey(new Date(r.fechaReserva));
      map[wk] = (map[wk] || 0) + 1;
    });
    return map;
  }, [reservas]);

  const getReservasSemana = (fecha: Date) => reservasPorSemana[getWeekKey(fecha)] || 0;

  const aulasOcupadasEnDia = (fecha: Date): number[] =>
    reservasEnDia(fecha).map((r) => r.claseId);

  const getDayStatus = (fecha: Date) => {
    const esPasado = fecha < hoy;
    const esFuturoLejano = fecha > fechaLimite;
    const tieneReserva = reservasEnDia(fecha).length > 0;
    const semanaLlena = getReservasSemana(fecha) >= MAX_DIAS_SEMANA;
    const disponibles = TOTAL_AULAS - aulasOcupadasEnDia(fecha).length;
    return { esPasado, esFuturoLejano, tieneReserva, semanaLlena, disponibles };
  };

  const abrirModal = (fecha: Date) => {
    const { esPasado, esFuturoLejano, semanaLlena, disponibles } = getDayStatus(fecha);
    if (esPasado || esFuturoLejano) return;
    if (semanaLlena) {
      setErrorMsg('Has alcanzado el límite de 3 reservas esta semana.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    if (disponibles <= 0) {
      setErrorMsg('No quedan aulas disponibles para este día.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    const ocupadas = aulasOcupadasEnDia(fecha);
    const primeraLibre =
      Array.from({ length: TOTAL_AULAS }, (_, i) => i + 1).find((n) => !ocupadas.includes(n)) || 1;
    setAulaSeleccionada(primeraLibre);
    setTipoUso('PERSONAL');
    setModal({ fecha, open: true });
  };

  const confirmarReserva = async () => {
    if (!modal.fecha || !usuario?.id) return;
    setConfirmandoReserva(true);
    try {
      await reservaService.create({
        usuarioId: usuario.id,
        claseId: aulaSeleccionada,
        fechaReserva: toLocalISOString(modal.fecha),
      });
      const fechaStr = modal.fecha.toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
      setModal({ fecha: null, open: false });
      setSuccessMsg(`Aula ${aulaSeleccionada} reservada para el ${fechaStr}`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchReservas();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'Error al crear la reserva. Inténtalo de nuevo.';
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setConfirmandoReserva(false);
    }
  };

  const cancelarReserva = async (reservaId: string, fecha: Date) => {
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    if (!confirm(`¿Cancelar la reserva del ${fechaStr}?`)) return;
    try {
      await reservaService.delete(reservaId);
      setSuccessMsg('Reserva cancelada.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchReservas();
    } catch {
      setErrorMsg('Error al cancelar la reserva.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const firstDay = calendarDays[0];
  const lastDay = calendarDays[calendarDays.length - 1];
  const headerLabel =
    firstDay.getMonth() === lastDay.getMonth()
      ? `${MESES[firstDay.getMonth()]} ${firstDay.getFullYear()}`
      : `${MESES[firstDay.getMonth()]} – ${MESES[lastDay.getMonth()]} ${lastDay.getFullYear()}`;

  const puedeIrAtras = vistaOffset > 0;
  const puedeIrAdelante = calendarDays.some((d) => d <= fechaLimite && d > hoy);

  const proximasReservas = useMemo(
    () =>
      reservas
        .filter((r) => new Date(r.fechaReserva) >= hoy)
        .sort((a, b) => new Date(a.fechaReserva).getTime() - new Date(b.fechaReserva).getTime())
        .slice(0, 5),
    [reservas, hoy],
  );

  const semanaActualKey = getWeekKey(hoy);
  const reservasSemanaActual = reservasPorSemana[semanaActualKey] || 0;

  const aulasLibresModal = modal.fecha
    ? Array.from({ length: TOTAL_AULAS }, (_, i) => i + 1).filter(
        (n) => !aulasOcupadasEnDia(modal.fecha!).includes(n),
      )
    : [];

  return (
    <div className="reserva-calendario">
      <div className="rc-header">
        <div className="rc-header-left">
          <h2>Reserva de Aulas</h2>
          <p className="rc-subtitle">Elige tu día y aula para entrenar</p>
        </div>
        <div className="rc-stats">
          <div className="rc-stat">
            <span className="rc-stat-number">{reservasSemanaActual}</span>
            <span className="rc-stat-label">reservas esta semana</span>
          </div>
          <div className="rc-stat-divider" />
          <div className="rc-stat">
            <span className="rc-stat-number">{MAX_DIAS_SEMANA - reservasSemanaActual}</span>
            <span className="rc-stat-label">disponibles</span>
          </div>
          <div className={`rc-week-progress ${reservasSemanaActual >= MAX_DIAS_SEMANA ? 'full' : ''}`}>
            {Array.from({ length: MAX_DIAS_SEMANA }).map((_, i) => (
              <div key={i} className={`rc-dot ${i < reservasSemanaActual ? 'filled' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {successMsg && <div className="rc-toast rc-toast-success">{successMsg}</div>}
      {errorMsg && <div className="rc-toast rc-toast-error">{errorMsg}</div>}

      <div className="rc-calendar-wrapper">
        <div className="rc-calendar-nav">
          <button className="rc-nav-btn" onClick={() => setVistaOffset((v) => v - 1)} disabled={!puedeIrAtras}>‹</button>
          <h3 className="rc-month-label">{headerLabel}</h3>
          <button className="rc-nav-btn" onClick={() => setVistaOffset((v) => v + 1)} disabled={!puedeIrAdelante}>›</button>
        </div>

        <div className="rc-days-header">
          {DIAS_SEMANA.map((d) => <div key={d} className="rc-day-name">{d}</div>)}
        </div>

        <div className="rc-grid">
          {calendarDays.map((fecha, idx) => {
            const { esPasado, esFuturoLejano, tieneReserva, semanaLlena, disponibles } = getDayStatus(fecha);
            const esHoy = isSameDay(fecha, hoy);
            const bloqueado = esPasado || esFuturoLejano;
            const reservasDelDia = reservasEnDia(fecha);

            let cellClass = 'rc-day';
            if (esHoy) cellClass += ' rc-day-today';
            if (esPasado) cellClass += ' rc-day-past';
            if (esFuturoLejano) cellClass += ' rc-day-future-off';
            if (!bloqueado && tieneReserva) cellClass += ' rc-day-reserved';
            else if (!bloqueado && semanaLlena) cellClass += ' rc-day-week-full';
            else if (!bloqueado && disponibles === 0) cellClass += ' rc-day-no-aulas';
            else if (!bloqueado) cellClass += ' rc-day-available';

            return (
              <div key={idx} className={cellClass} onClick={() => !bloqueado && abrirModal(fecha)}>
                <span className="rc-day-num">{fecha.getDate()}</span>
                {esHoy && <span className="rc-today-label">Hoy</span>}
                {!bloqueado && (
                  <div className="rc-day-info">
                    {tieneReserva ? (
                      <span className="rc-day-badge reserved">Aula {reservasDelDia.map((r) => r.claseId).join(',')}</span>
                    ) : disponibles > 0 ? (
                      <span className="rc-day-badge available">{disponibles} libres</span>
                    ) : (
                      <span className="rc-day-badge full">Completo</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rc-legend">
        {[
          { cls: 'available', label: 'Disponible' },
          { cls: 'reserved', label: 'Tu reserva' },
          { cls: 'today', label: 'Hoy' },
          { cls: 'week-full', label: 'Semana llena' },
          { cls: 'full', label: 'Sin aulas' },
          { cls: 'past', label: 'Pasado' },
        ].map(({ cls, label }) => (
          <div key={cls} className="rc-legend-item">
            <div className={`rc-legend-dot ${cls}`} />
            {label}
          </div>
        ))}
      </div>

      {proximasReservas.length > 0 && (
        <div className="rc-upcoming">
          <h3>Tus próximas reservas</h3>
          <div className="rc-upcoming-list">
            {proximasReservas.map((r) => {
              const fecha = new Date(r.fechaReserva);
              const esManana = isSameDay(fecha, new Date(hoy.getTime() + 86400000));
              return (
                  <div key={r.id} className="rc-upcoming-card">
                    <div className="rc-upcoming-left">
                      <div>
                        <p className="rc-upcoming-aula">Aula {r.claseId}</p>
                        <p className="rc-upcoming-fecha">
                          {esManana ? 'Mañana · ' : ''}
                          {fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                  <button className="rc-cancel-btn" onClick={() => r.id && cancelarReserva(r.id, fecha)}>
                    Cancelar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="rc-loading">
          <div className="rc-spinner" />
          <p>Cargando reservas...</p>
        </div>
      )}

      {modal.open && modal.fecha && (
        <div className="rc-modal-overlay" onClick={() => setModal({ fecha: null, open: false })}>
          <div className="rc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="rc-modal-close" onClick={() => setModal({ fecha: null, open: false })}>✕</button>

            <div className="rc-modal-header">
              <div>
                <h3>Reservar Aula</h3>
                <p className="rc-modal-fecha">
                  {modal.fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="rc-modal-body">
              <p className="rc-modal-label">Tipo de uso</p>
              <div className="rc-tipo-selector">
                <button className={`rc-tipo-btn ${tipoUso === 'PERSONAL' ? 'active' : ''}`} onClick={() => setTipoUso('PERSONAL')}>
                  <span>Personal</span>
                  <small>Entrenamiento individual</small>
                </button>
                <button className={`rc-tipo-btn ${tipoUso === 'GRUPAL' ? 'active' : ''}`} onClick={() => setTipoUso('GRUPAL')}>
                  <span>Grupal</span>
                  <small>Hasta 10 personas</small>
                </button>
              </div>

              <p className="rc-modal-label">Selecciona un aula</p>
              <div className="rc-aulas-grid">
                {Array.from({ length: TOTAL_AULAS }, (_, i) => i + 1).map((n) => {
                  const ocupada = aulasOcupadasEnDia(modal.fecha!).includes(n);
                  return (
                    <button
                      key={n}
                      className={`rc-aula-btn ${ocupada ? 'ocupada' : ''} ${aulaSeleccionada === n && !ocupada ? 'selected' : ''}`}
                      onClick={() => !ocupada && setAulaSeleccionada(n)}
                      disabled={ocupada}
                      title={ocupada ? 'Aula ocupada' : `Seleccionar Aula ${n}`}
                    >
                      <span className="rc-aula-num">{n}</span>
                      <span className="rc-aula-state">{ocupada ? 'X' : 'O'}</span>
                    </button>
                  );
                })}
              </div>

              <div className="rc-modal-info">
                <span>Semana: {getReservasSemana(modal.fecha)}/{MAX_DIAS_SEMANA} reservas usadas</span>
                <span>{aulasLibresModal.length} de {TOTAL_AULAS} aulas libres</span>
              </div>
            </div>

            <div className="rc-modal-footer">
              <button className="rc-btn-cancel" onClick={() => setModal({ fecha: null, open: false })}>Cancelar</button>
              <button className="rc-btn-confirm" onClick={confirmarReserva} disabled={confirmandoReserva}>
                {confirmandoReserva ? <span className="rc-spinner-sm" /> : `Confirmar Aula ${aulaSeleccionada}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
