import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook que verifica e gera obrigações automaticamente
 * Executa uma vez ao montar o componente (quando o usuário abre o sistema)
 */
export function useAutoGenerate() {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastCheck, setLastCheck] = useState<string | null>(null);

    useEffect(() => {
        const checkAndGenerate = async () => {
            try {
                // Verificar se já gerou hoje
                const today = new Date().toISOString().split('T')[0];
                const lastCheckDate = localStorage.getItem('last_auto_generate');

                if (lastCheckDate === today) {
                    console.log('Obrigações já foram verificadas hoje');
                    return;
                }

                setIsGenerating(true);

                // Chamar função do Supabase para gerar obrigações
                const { data, error } = await supabase.rpc('generate_monthly_obligations' as any) as any;

                if (error) {
                    console.error('Erro ao gerar obrigações:', error);
                    return;
                }

                // Salvar data da última verificação
                localStorage.setItem('last_auto_generate', today);
                setLastCheck(today);

                // Mostrar notificação se criou obrigações
                if (data && data.obligations_created > 0) {
                    toast({
                        title: '🤖 Obrigações geradas automaticamente!',
                        description: `${data.obligations_created} obrigações foram criadas para ${data.clients_processed} clientes.`,
                    });
                }

            } catch (err) {
                console.error('Erro na automação:', err);
            } finally {
                setIsGenerating(false);
            }
        };

        // Executar após 2 segundos (para não atrasar o carregamento inicial)
        const timer = setTimeout(() => {
            checkAndGenerate();
        }, 2000);

        return () => clearTimeout(timer);
    }, [toast]);

    return { isGenerating, lastCheck };
}
