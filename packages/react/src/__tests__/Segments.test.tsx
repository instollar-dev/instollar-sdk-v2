import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Segments } from '../components/Segments';

describe('Segments', () => {
  it('renders options and selects via click', () => {
    const onChange = vi.fn();
    render(
      <Segments
        options={[
          { value: 'pipeline', label: 'Pipeline' },
          { value: 'table', label: 'Table' },
        ]}
        value="pipeline"
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pipeline' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Table' })).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(screen.getByRole('radio', { name: 'Table' }));
    expect(onChange).toHaveBeenCalledWith('table');
  });

  it('supports uncontrolled defaultValue', () => {
    render(
      <Segments
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        defaultValue="b"
      />,
    );
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'true');
  });

  it('navigates with replace in router mode', () => {
    const navigate = vi.fn();
    const onChange = vi.fn();

    render(
      <Segments
        useRoutes
        basePath="/leads"
        router={{ pathname: '/leads/pipeline', navigate }}
        defaultValue="pipeline"
        onChange={onChange}
        options={[
          { value: 'pipeline', label: 'Pipeline', path: 'pipeline' },
          { value: 'table', label: 'Table', path: 'table' },
        ]}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Pipeline' })).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith('pipeline');

    fireEvent.click(screen.getByRole('radio', { name: 'Table' }));
    expect(navigate).toHaveBeenCalledWith('/leads/table', { replace: true });
  });

  it('redirects index path to defaultValue in router mode', () => {
    const navigate = vi.fn();

    render(
      <Segments
        useRoutes
        basePath="/leads"
        router={{ pathname: '/leads', navigate }}
        defaultValue="table"
        options={[
          { value: 'pipeline', label: 'Pipeline', path: 'pipeline' },
          { value: 'table', label: 'Table', path: 'table' },
        ]}
      />,
    );

    expect(navigate).toHaveBeenCalledWith('/leads/table', { replace: true });
  });
});
